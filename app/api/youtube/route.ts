import { NextRequest, NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"

export const POST = async (req: NextRequest) => {
  try {
    const { videoId } = await req.json()

    if (!videoId) {
      return NextResponse.json(
        {
          message: "Video ID is required",
          success: false
        },
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
          throw new Error("No transcript available")
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
        throw new Error(`Failed to fetch transcript: ${error.message}`)
      }
    }

    const data = await getVideoTranscript(videoId)

    return NextResponse.json(
      {
        message: "Transcript extracted successfully",
        data,
        success: true
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error processing YouTube transcript:", error)
    return NextResponse.json(
      {
        message: error.message || "Failed to process YouTube transcript",
        success: false
      },
      { status: 500 }
    )
  }
}
