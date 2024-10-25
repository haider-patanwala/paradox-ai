import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        return NextResponse.json(
            { message: "hello world" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in /api/embedding POST handler:", error);
        return NextResponse.json(
            { message: "Failed to store embedding", error: error.message },
            { status: 500 }
        );
    }
};
