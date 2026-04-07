"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut, UserCircle2 } from "lucide-react";

export function UserNav() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-border/80 bg-card p-1 transition-all hover:bg-muted/60 cursor-pointer"
      >
        {user.imageUrl ? (
          <Image 
            src={user.imageUrl} 
            alt={user.fullName || "User"} 
            width={32} 
            height={32} 
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            {user.firstName?.charAt(0) || "U"}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-border/90 bg-card/95 p-0 shadow-[0_18px_45px_-28px_rgba(32,24,12,0.45)] backdrop-blur supports-backdrop-filter:bg-card/85 animate-in fade-in zoom-in-95 duration-200">
          <div className="border-b border-border/80 px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Signed in as
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">{user.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
          </div>

          <div className="p-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground/90 transition-colors hover:bg-muted/70"
              onClick={() => setIsOpen(false)}
            >
              <UserCircle2 className="h-4 w-4 text-muted-foreground" />
              Account
            </button>
            <button 
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/8 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
