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
    // const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
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

    // Sample data extraction, e.g., page title and paragraphs with a word limit
    const pageTitle = $$("title").text()
    const wordLimit = 20000
    let totalWords = 0
    const paragraphs: any = []

    $$("p").each((_, p) => {
      const paragraphText = $$(p).text()
      const paragraphWords = paragraphText.split(/\s+/).length

      if (totalWords + paragraphWords <= wordLimit) {
        paragraphs.push(paragraphText)
        totalWords += paragraphWords
      } else {
        // If adding this paragraph would exceed the word limit, add only enough words to reach the limit
        const remainingWords = wordLimit - totalWords
        const limitedText = paragraphText
          .split(/\s+/)
          .slice(0, remainingWords)
          .join(" ")
        paragraphs.push(limitedText)
        totalWords = wordLimit // Set totalWords to the limit to break out of loop
        return false // Breaks out of .each loop
      }
    })

    console.log("Page Title:", pageTitle)
    console.log("Total Words:", totalWords)
    console.log("Paragraphs (limited):", paragraphs)

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

    return NextResponse.json(
      { message: "Link got successfully", data },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching article", error },
      { status: 500 }
    )
  }
}
