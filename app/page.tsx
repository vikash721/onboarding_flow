import { auth } from "@clerk/nextjs/server";
import { LandingView } from "@/components/landing-view";
import { FormView } from "@/components/form-view";

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

  return (
    <div className="w-full min-h-[calc(100vh-5rem)]">
      <FormView />
    </div>
  );
}
