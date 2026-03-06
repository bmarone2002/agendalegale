import { CalendarView } from "@/components/calendar/CalendarView";
import { AppShell } from "@/components/layout/AppShell";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <AppShell>
      <SignedIn>
        <CalendarView />
      </SignedIn>
      <SignedOut>
        <div className="mx-auto max-w-xl rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-[var(--navy)]">
            Accedi per usare l&apos;Agenda Legale
          </h2>
          <p className="mb-4 text-sm text-zinc-600">
            Crea un account o accedi per vedere e gestire la tua agenda personale.
          </p>
          <SignInButton mode="redirect">
            <button className="rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-light)]">
              Vai al login
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </AppShell>
  );
}
