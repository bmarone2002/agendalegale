export default function PrivacyPage() {
  return (
    <article className="space-y-4">
      <header className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
        <h2 className="text-xl font-semibold text-[var(--navy)]">Privacy Policy (GDPR)</h2>
        <p className="mt-1 text-sm text-zinc-500">Versione 2026-04-21 - Informativa ex artt. 13-14 GDPR.</p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Dati trattati</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Trattiamo dati identificativi/account, dati di utilizzo della piattaforma e dati tecnici necessari a sicurezza, audit e
          funzionamento.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Finalita&apos; e basi giuridiche</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Esecuzione del contratto, adempimenti legali/fiscali, sicurezza del servizio e tutela dei diritti del titolare.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Fornitori terzi</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Alcuni trattamenti avvengono tramite fornitori esterni quali Clerk (autenticazione) e Stripe (pagamenti), nominati ove
          necessario responsabili del trattamento.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Diritti dell&apos;interessato</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Puoi esercitare i diritti previsti dagli artt. 15-22 GDPR (accesso, rettifica, cancellazione, limitazione, opposizione,
          portabilita&apos;) e proporre reclamo al Garante.
        </p>
      </section>
    </article>
  );
}
