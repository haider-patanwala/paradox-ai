import { NextRequest, NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"
export const POST = async (req: NextRequest) => {
  try {
    const { isTimeRequired, videoId } = await await req.json()

    if (!videoId) {
      return NextResponse.json(
        { message: "videoId are required" },
        { status: 400 }
      )
    }
    const getVideoTranscript = async (videoId: string) => {
      try {
        console.log("videoId", videoId)
        const transcript = await YoutubeTranscript.fetchTranscript(videoId)
        console.log("the transcript", transcript)
        if (isTimeRequired) {
          console.log("the trans", transcript)
          return transcript
        }
        let content = ""
        let wordCount = 0
        const wordLimit = 19999
        if (!transcript) {
          return "data"
        }

        for (const segment of transcript) {
          const words = segment.text.split(/\s+/)
          if (wordCount + words.length <= wordLimit) {
            content += segment.text + " "
            wordCount += words.length
          } else {
            const remainingWords = wordLimit - wordCount
            content += words.slice(0, remainingWords).join(" ") + " "
            break
          }
        }

        return content.trim()
      } catch (error: any) {
        return NextResponse.json(
          { message: "Failed to fetch transcript", error: error.message },
          { status: 500 }
        )
      }
    }

    const data = await getVideoTranscript(videoId)

    return NextResponse.json({ message: "hello world", data }, { status: 200 })
  } catch (error: any) {
    console.error("Error in /api/embedding POST handler:", error)
    return NextResponse.json(
      { message: "Failed to store embedding", error: error.message },
      { status: 500 }
    )
  }
}
