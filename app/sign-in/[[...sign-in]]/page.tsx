import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-8",
            headerTitle: "text-2xl font-semibold text-[#2D233C]",
            headerSubtitle: "text-[#2D233C]/60",
            socialButtonsBlockButton: 
              "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl py-3 transition-colors",
            socialButtonsBlockButtonText: "font-medium",
            socialButtonsBlockButtonArrow: "text-slate-400",
            dividerLine: "bg-slate-200",
            dividerText: "text-slate-400 font-medium text-xs",
            formFieldLabel: "text-slate-600 font-medium",
            formFieldInput: 
              "border border-slate-200 rounded-xl bg-white px-4 py-3 focus:ring-2 focus:ring-[#2D233C]/20 border-transparent outline-none transition-all placeholder:text-slate-400",
            formButtonPrimary: 
              "bg-[#2D233C] hover:bg-[#1f182a] text-white rounded-xl py-3 text-sm font-medium transition-all shadow-sm",
            footerActionText: "text-slate-500",
            footerActionLink: "text-[#2D233C] font-medium hover:text-[#1f182a]",
            identityPreviewText: "text-slate-700",
            identityPreviewEditButtonIcon: "text-slate-400 hover:text-slate-600",
          },
          layout: {
            socialButtonsPlacement: 'bottom',
          }
        }}
      />
    </div>
  );
}
