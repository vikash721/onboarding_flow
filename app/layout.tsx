import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { UserNav } from "@/components/user-nav";
import { SyncUser } from "@/components/sync-user";
import "./globals.css";
import { cn } from "@/lib/utils";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Premium Contact | OnboardInflow",
  description: "Minimalist and elegant contact experience.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <html lang="en" className={cn("h-full", "antialiased", sans.variable, serif.variable, "font-sans")}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ClerkProvider>
          <SyncUser />
          {userId && (
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border/70 bg-background/85 px-4 py-4 backdrop-blur-md supports-backdrop-filter:bg-background/70 sm:px-8 pointer-events-none">
              <div className="pointer-events-auto flex min-w-0 items-center gap-3">
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    OnboardInflow
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground/95">Candidate workspace</p>
                </div>
              </div>

              <div className="pointer-events-auto flex gap-2">
                <UserNav />
              </div>
            </header>
          )}

          <main className={`flex flex-1 flex-col ${userId ? "pt-17" : ""}`}>
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
