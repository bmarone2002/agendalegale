export default function TermsPage() {
  return (
    <article className="space-y-4">
      <header className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
        <h2 className="text-xl font-semibold text-[var(--navy)]">Termini di Servizio</h2>
        <p className="mt-1 text-sm text-zinc-500">Versione 2026-04-21</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-700">
          Agenda Legale e&apos; un software di supporto organizzativo per studi legali. Non costituisce consulenza legale e non
          sostituisce il giudizio professionale dell&apos;utente.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Uso del servizio</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          L&apos;utente e&apos; responsabile dell&apos;account e della correttezza dei dati inseriti. E&apos; vietato l&apos;uso illecito o
          l&apos;accesso non autorizzato alla piattaforma.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Abbonamento e rinnovo</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Eventuali piani in abbonamento possono prevedere rinnovo automatico. Prezzi e periodicita&apos; sono mostrati prima della
          conferma del checkout.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Limitazione di responsabilita&apos;</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Nei limiti di legge e salvo dolo o colpa grave, il fornitore non risponde di danni indiretti o da uso improprio della
          piattaforma.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Legge applicabile</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Si applica la legge italiana, con tutela del foro del consumatore ove prevista.
        </p>
      </section>
    </article>
  );
}
