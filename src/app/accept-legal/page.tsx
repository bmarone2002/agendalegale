"use client";

import Link from "next/link";
import { useState } from "react";

export default function AcceptLegalPage() {
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!accepted) {
      setError("Devi accettare i documenti per continuare.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/legal/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: true }),
      });
      const json = await response.json();
      if (!response.ok || !json?.success) {
        throw new Error(json?.error ?? "Errore nel salvataggio del consenso");
      }
      window.location.assign("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore inatteso";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#f5f0e6] via-[#f8f4ec] to-[var(--surface)] px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-8 h-52 w-52 -translate-x-1/2 rounded-full bg-[var(--gold)]/15 blur-3xl" />
      </div>
      <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--gold)]/20 bg-white/95 p-6 shadow-xl shadow-[var(--navy)]/10 backdrop-blur-sm sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gold)]">Passaggio obbligatorio</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">Accettazione documenti legali</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Per usare Agenda Legale devi leggere e accettare i documenti legali.
        </p>

        <ul className="mt-5 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
          <li className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
            <Link href="/legal/terms" className="font-medium text-[var(--navy)] hover:underline">
              Termini di Servizio
            </Link>
          </li>
          <li className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
            <Link href="/legal/privacy" className="font-medium text-[var(--navy)] hover:underline">
              Privacy Policy (GDPR)
            </Link>
          </li>
          <li className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
            <Link href="/legal/cookie" className="font-medium text-[var(--navy)] hover:underline">
              Cookie Policy
            </Link>
          </li>
          <li className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
            <Link href="/legal/subscription" className="font-medium text-[var(--navy)] hover:underline">
              Condizioni Abbonamento e Recesso
            </Link>
          </li>
        </ul>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--navy)]"
            />
            <span>
              Dichiaro di aver letto e accettato i documenti legali indicati sopra.
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-lg bg-[var(--navy)] px-5 text-sm font-medium text-white shadow-md shadow-[var(--navy)]/20 transition-colors hover:bg-[var(--navy-light)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Salvataggio..." : "Accetta e continua"}
          </button>
        </form>
      </div>
    </div>
  );
}
