import { auth } from "@clerk/nextjs/server";
import { LandingView } from "@/components/landing-view";
import { FormView } from "@/components/form-view";
import { getLatestSubmissionForUser } from "@/lib/db/submission";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
        <div className="z-10 w-full max-w-md">
          <LandingView />
        </div>
      </div>
    );
  }

  let hasSubmitted = false;
  let initialData: Record<string, string | null> | undefined;
  try {
    const submission = await getLatestSubmissionForUser(userId);
    hasSubmitted = Boolean(submission);

    if (submission) {
      initialData = {
        fullName: submission.personal?.fullName ?? "",
        email: submission.personal?.email ?? "",
        phone: submission.personal?.phone ?? "",
        profilePicture: submission.personal?.profilePicture ?? null,
        aadhaarPan: submission.personal?.aadhaarPan ?? "",
        address: submission.address?.address ?? "",
        city: submission.address?.city ?? "",
        state: submission.address?.state ?? "",
        zipCode: submission.address?.zipCode ?? "",
        country: submission.address?.country ?? "",
        parentName: submission.family?.parentName ?? "",
        parentPhone: submission.family?.parentPhone ?? "",
        bankAccountName: submission.bank?.bankAccountName ?? "",
        accountNumber: submission.bank?.accountNumber ?? "",
        ifscCode: submission.bank?.ifscCode ?? "",
        swiftCode: submission.bank?.swiftCode ?? "",
        linkedPhone: submission.bank?.linkedPhone ?? "",
        telegram: submission.social?.telegram ?? "",
        linkedin: submission.social?.linkedin ?? "",
        xHandle: submission.social?.xHandle ?? "",
        github: submission.social?.github ?? "",
      };
    }
  } catch (error) {
    console.error("Failed to load submission status:", error);
  }

  return (
    <div className="w-full min-h-[calc(100vh-5rem)]">
      <FormView initialSubmitted={hasSubmitted} initialData={initialData} />
    </div>
  );
}
