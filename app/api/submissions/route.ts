import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createSubmission } from "@/lib/db/submission";
import { sendSubmissionToTelegram } from "@/lib/notifications/telegram";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const rawBody = await req.json();
    const user = await currentUser();

    const payload = {
      clerkId: userId,
      userEmail: user?.primaryEmailAddress?.emailAddress ?? null,
      personal: {
        fullName: rawBody?.fullName,
        email: rawBody?.email,
        phone: rawBody?.phone,
        aadhaarPan: rawBody?.aadhaarPan,
        profilePicture: rawBody?.profilePicture ?? null,
      },
      address: {
        address: rawBody?.address,
        city: rawBody?.city,
        state: rawBody?.state,
        zipCode: rawBody?.zipCode,
        country: rawBody?.country,
      },
      family: {
        parentName: rawBody?.parentName,
        parentPhone: rawBody?.parentPhone,
      },
      bank: {
        bankAccountName: rawBody?.bankAccountName,
        accountNumber: rawBody?.accountNumber,
        ifscCode: rawBody?.ifscCode,
        swiftCode: rawBody?.swiftCode ?? null,
        linkedPhone: rawBody?.linkedPhone,
      },
      social: {
        telegram: rawBody?.telegram,
        linkedin: rawBody?.linkedin || null,
        xHandle: rawBody?.xHandle || null,
        github: rawBody?.github || null,
      },
      submittedAt: new Date(),
    };

    const result = await createSubmission(payload);

    try {
      await sendSubmissionToTelegram({
        submissionId: result.insertedId.toString(),
        clerkId: payload.clerkId,
        userEmail: payload.userEmail,
        personal: payload.personal,
        address: payload.address,
        family: payload.family,
        bank: payload.bank,
        social: payload.social,
        submittedAt: payload.submittedAt,
      });
    } catch (notificationError) {
      console.error("Submission saved, but Telegram notification failed:", notificationError);
    }

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: "Submission stored successfully",
    });
  } catch (error) {
    console.error("Error creating onboarding submission:", error);
    return new NextResponse("Invalid submission payload", { status: 400 });
  }
}
