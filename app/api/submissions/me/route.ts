import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  countSubmissionsForUser,
  deleteSubmissionsForUser,
  getLatestSubmissionForUser,
} from "@/lib/db/submission";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [count, latest] = await Promise.all([
      countSubmissionsForUser(userId),
      getLatestSubmissionForUser(userId),
    ]);

    return NextResponse.json({
      success: true,
      count,
      latestSubmissionId: latest?._id?.toString?.() ?? null,
      latestSubmittedAt: latest?.submittedAt ?? null,
    });
  } catch (error) {
    console.error("Failed to inspect user submissions:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await deleteSubmissionsForUser(userId);

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Failed to delete user submissions:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
