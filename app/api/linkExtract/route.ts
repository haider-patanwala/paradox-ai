import * as cheerio from "cheerio"
import { NextRequest } from "next/dist/server/web/spec-extension/request"
import { NextResponse } from "next/server"

async function getLink(query: string): Promise<any> {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))
  if (!query) throw new Error("Title is required")

  const puppeteer = await import("puppeteer")
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true
  })

  try {
    const page = await browser.newPage()
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" })

    await delay(1000)

    const content = await page.content()
    const $ = cheerio.load(content)

    // Find the first search result link
    const linkElement = $("a:has(h3)").first()
    const linkUrl = linkElement.attr("href")

    if (!linkUrl) throw new Error("No link found in search results.")

    // Navigate to the first link's URL
    await page.goto(linkUrl, { waitUntil: "domcontentloaded" })

    // Extract content from the target page
    const targetContent = await page.content()
    const $$ = cheerio.load(targetContent)

    // Sample data extraction, e.g., page title and paragraphs
    const pageTitle = $$("title").text()
    const paragraphs = $$("p")
      .map((_, p) => $$(p).text())
      .get()

    console.log("Page Title:", pageTitle)
    console.log("Paragraphs:", paragraphs)

    return { title: pageTitle, content: paragraphs }
  } catch (error) {
    console.error("Error fetching article:", error)
    throw error
  } finally {
    await browser.close()
  }
}
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json(
        { message: "query is required" },
        { status: 400 }
      )
    }

    const data = await getLink(query)
    console.log("data", data)

    return NextResponse.json({ message: "hello world" }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching article", error },
      { status: 500 }
    )
  }
}
