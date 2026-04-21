import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f5f0e6] via-[#f8f4ec] to-[var(--surface)] px-4 py-12 sm:py-16"
    >
      <div className="w-full max-w-md rounded-2xl border border-[var(--gold)]/20 bg-white/95 p-6 shadow-xl shadow-[var(--navy)]/10 backdrop-blur-sm sm:p-8">
        <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--gold)]">
          Prova gratuita 30 giorni
        </p>
        <h1 className="mb-6 text-center text-lg font-semibold text-[var(--navy)] sm:text-xl">
          Crea il tuo account – Agenda Legale
        </h1>
        <SignUp />
        <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
          Proseguendo dichiari di aver letto{" "}
          <Link href="/legal/terms" className="font-medium text-[var(--navy)] underline underline-offset-2 hover:text-[var(--navy-light)]">
            Termini
          </Link>
          ,{" "}
          <Link href="/legal/privacy" className="font-medium text-[var(--navy)] underline underline-offset-2 hover:text-[var(--navy-light)]">
            Privacy
          </Link>{" "}
          e{" "}
          <Link href="/legal/cookie" className="font-medium text-[var(--navy)] underline underline-offset-2 hover:text-[var(--navy-light)]">
            Cookie Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

