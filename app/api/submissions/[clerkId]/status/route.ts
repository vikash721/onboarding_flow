import { NextRequest, NextResponse } from "next/server";
import { updateSubmissionStatus } from "@/lib/db/submission";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params;
    
    // Simple security check for Telegram bot or internal calls
    const authHeader = request.headers.get("x-api-secret");
    if (process.env.INTERNAL_API_SECRET && authHeader !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { offerLetterSent, offerLetterSigned } = body;

    if (offerLetterSent === undefined && offerLetterSigned === undefined) {
      return NextResponse.json(
        { error: "At least one status field must be provided" },
        { status: 400 }
      );
    }

    const result = await updateSubmissionStatus(clerkId, {
      offerLetterSent,
      offerLetterSigned,
    });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Submission not found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission status updated successfully",
    });
  } catch (error) {
    console.error("Error updating submission status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
