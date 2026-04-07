import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 font-light">Completing authentication...</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
