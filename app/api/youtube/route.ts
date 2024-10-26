import { NextRequest, NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"

export const POST = async (req: NextRequest) => {
  try {
    const { videoId, isTimeRequired } = await req.json()

    if (!videoId) {
      return NextResponse.json(
        {
          message: "Video ID is required",
          success: false
        },
        { status: 400 }
      )
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    
    if (!transcript) {
      throw new Error("No transcript available")
    }

    let data;
    if (isTimeRequired) {
      // Return full transcript with timestamps
      data = transcript.map((segment: { text: string; start?: number; duration?: number }) => ({
        text: segment.text,
        start: segment.start,
        duration: segment.duration
      }))
    } else {
      // Return concatenated text only
      data = transcript
        .map(segment => segment.text)
        .join(' ')
        .slice(0, 19999); // Keep within token limits
    }

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
