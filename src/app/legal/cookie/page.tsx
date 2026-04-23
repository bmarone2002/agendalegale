export default function CookiePage() {
  return (
    <article className="space-y-4">
      <header className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
        <h2 className="text-xl font-semibold text-[var(--navy)]">Cookie Policy</h2>
        <p className="mt-1 text-sm text-zinc-500">Versione 2026-04-21</p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Cookie tecnici</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Il sito usa cookie tecnici e funzionali necessari a autenticazione, sicurezza e uso dell&apos;applicazione.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Cookie non tecnici</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Se saranno introdotti cookie non tecnici/profilazione, verra&apos; richiesto consenso preventivo tramite apposito banner.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h3 className="text-base font-semibold text-[var(--navy)]">Gestione preferenze</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Puoi gestire o disabilitare i cookie dal browser; la disattivazione dei cookie tecnici puo&apos; compromettere il servizio.
        </p>
      </section>
    </article>
  );
}
