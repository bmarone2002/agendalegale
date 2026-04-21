import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f5f0e6] via-[#f8f4ec] to-[var(--surface)] px-4 py-12 sm:py-16"
    >
      <div className="w-full max-w-md rounded-2xl border border-[var(--gold)]/20 bg-white/95 p-6 shadow-xl shadow-[var(--navy)]/10 backdrop-blur-sm sm:p-8">
        <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--gold)]">
          Accesso sicuro
        </p>
        <h1 className="mb-6 text-center text-lg font-semibold text-[var(--navy)] sm:text-xl">
          Accedi alla tua Agenda Legale
        </h1>
        <SignIn />
      </div>
    </div>
  );
}

