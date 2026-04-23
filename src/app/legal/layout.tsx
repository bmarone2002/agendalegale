import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f5f0e6] via-[#f8f4ec] to-[var(--surface)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-[var(--gold)]/15 blur-3xl" />
      </div>
      <div className="relative mx-auto w-full max-w-4xl rounded-2xl border border-[var(--gold)]/20 bg-white/90 p-6 shadow-xl shadow-[var(--navy)]/10 backdrop-blur-sm sm:p-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gold)]">
          Documentazione Legale
        </p>
        <h1 className="mt-2 text-center text-2xl font-semibold text-[var(--navy)] sm:text-[1.75rem]">
          Trasparenza e tutela, in modo chiaro
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-zinc-600">
          Qui trovi tutti i documenti essenziali per usare Agenda Legale in modo informato e sicuro.
        </p>
        <div className="mt-6 mb-6 flex flex-wrap items-center justify-center gap-2 border-b border-zinc-200 pb-5 text-sm">
          <Link href="/" className="rounded-full border border-[var(--navy)]/20 bg-[var(--navy)]/5 px-3 py-1.5 font-medium text-[var(--navy)] transition-colors hover:bg-[var(--navy)]/10">
            Home
          </Link>
          <Link href="/legal/terms" className="rounded-full border border-zinc-200 px-3 py-1.5 text-zinc-600 transition-colors hover:border-[var(--navy)]/20 hover:text-[var(--navy)]">
            Termini
          </Link>
          <Link href="/legal/privacy" className="rounded-full border border-zinc-200 px-3 py-1.5 text-zinc-600 transition-colors hover:border-[var(--navy)]/20 hover:text-[var(--navy)]">
            Privacy
          </Link>
          <Link href="/legal/cookie" className="rounded-full border border-zinc-200 px-3 py-1.5 text-zinc-600 transition-colors hover:border-[var(--navy)]/20 hover:text-[var(--navy)]">
            Cookie
          </Link>
          <Link href="/legal/subscription" className="rounded-full border border-zinc-200 px-3 py-1.5 text-zinc-600 transition-colors hover:border-[var(--navy)]/20 hover:text-[var(--navy)]">
            Abbonamento
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
