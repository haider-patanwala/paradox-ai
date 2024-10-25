import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
    try {
        return NextResponse.json(
            { message: "Hello from sample" },
            { status: 200 }
          )
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to Send Email", error },
            { status: 500 }
          )
    }
}