"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
  /** Optional right-side header content (e.g. breadcrumb title) */
  headerTitle?: React.ReactNode;
}

export function AppShell({ children, headerTitle }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)]" style={{ backgroundColor: "var(--surface)" }}>
      <div className="flex min-h-screen flex-1">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header
            className="flex h-14 shrink-0 items-center justify-end gap-3 border-b border-[var(--navy)]/20 bg-[var(--navy)] px-4 sm:px-6"
            style={{ backgroundColor: "var(--navy)" }}
          >
            {headerTitle && (
              <div className="mr-auto flex items-center gap-2 text-white/90">
                {headerTitle}
              </div>
            )}
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "ring-2 ring-[var(--gold)]/50",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-md border border-[var(--gold)] px-3 py-1.5 text-sm font-medium text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors"
                >
                  Accedi
                </button>
              </SignInButton>
            </SignedOut>
          </header>
          <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
