"use client";

import { FormEvent, useMemo, useState } from "react";

type Category = "accesso" | "calendario" | "pagamenti" | "bug" | "altro";
type Priority = "normale" | "urgente";

const categoryOptions: { value: Category; label: string }[] = [
  { value: "accesso", label: "Accesso / Account" },
  { value: "calendario", label: "Calendario / Scadenze" },
  { value: "pagamenti", label: "Pagamenti" },
  { value: "bug", label: "Bug tecnico" },
  { value: "altro", label: "Altro" },
];

const faqByCategory: Record<Category, { question: string; href: string }[]> = {
  accesso: [
    { question: "Posso usare Agenda Legale da più dispositivi?", href: "#faq" },
    { question: "Non vedo più un evento che avevo inserito, cosa posso fare?", href: "#faq" },
  ],
  calendario: [
    { question: "Qual è la differenza tra 'Da fare' e 'Completati'?", href: "#faq" },
    { question: "Qual è l'ordine corretto di lavoro in Agenda Legale?", href: "#faq" },
  ],
  pagamenti: [
    { question: "Controlla la sezione profilo e stato piano per la fatturazione.", href: "/profilo" },
    { question: "Se non risolvi, invia una richiesta con oggetto dettagliato.", href: "#supporto-form" },
  ],
  bug: [
    { question: "Non vedo più un evento che avevo inserito, cosa posso fare?", href: "#faq" },
    { question: "Inserisci nel ticket pagina e passaggi per riprodurre il problema.", href: "#supporto-form" },
  ],
  altro: [
    { question: "Consulta prima le domande frequenti qui sotto.", href: "#faq" },
    { question: "Se non trovi risposta, apri una richiesta dal form.", href: "#supporto-form" },
  ],
};

export function SupportContactCard() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<Category>("calendario");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<Priority>("normale");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

  const suggestedFaq = useMemo(() => faqByCategory[category], [category]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessTicketId(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          category,
          subject,
          message,
          priority,
          privacyAccepted,
          pageUrl: window.location.href,
        }),
      });

      const data = (await response.json()) as { success: boolean; ticketId?: string; error?: string };
      if (!response.ok || !data.success || !data.ticketId) {
        throw new Error(data.error ?? "Errore durante l'invio.");
      }

      setSuccessTicketId(data.ticketId);
      setSubject("");
      setMessage("");
      setPriority("normale");
      setPrivacyAccepted(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore inatteso.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="supporto-form"
      className="relative overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-[var(--gold)]/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-[var(--navy)]/8 blur-2xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
          <span aria-hidden="true">🆘</span>
          Assistenza
        </div>
        <h3 className="mt-3 text-lg font-semibold text-[var(--navy)] sm:text-xl">
          Non hai risolto? Contatta il supporto
        </h3>
        <p className="mt-1 text-sm text-zinc-700">
          Prima di inviare la richiesta, controlla i suggerimenti rapidi in base alla categoria selezionata.
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Suggerimenti guida</p>
        <ul className="mt-2 space-y-2 text-xs text-zinc-700 sm:text-sm">
          {suggestedFaq.map((item) => (
            <li key={item.question} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
              <a
                className="underline-offset-4 transition-colors hover:text-[var(--navy)] hover:underline"
                href={item.href}
              >
                {item.question}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm text-zinc-700">
            <span className="font-medium text-[var(--navy)]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors ring-[var(--gold)]/30 placeholder:text-zinc-400 focus:border-[var(--gold)] focus:ring"
              placeholder="nome@studio.it"
            />
          </label>

          <label className="grid gap-1.5 text-sm text-zinc-700">
            <span className="font-medium text-[var(--navy)]">Categoria</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors ring-[var(--gold)]/30 focus:border-[var(--gold)] focus:ring"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-1.5 text-sm text-zinc-700">
          <span className="font-medium text-[var(--navy)]">Oggetto</span>
          <input
            type="text"
            required
            maxLength={120}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors ring-[var(--gold)]/30 placeholder:text-zinc-400 focus:border-[var(--gold)] focus:ring"
            placeholder="Es. non riesco ad accedere al calendario"
          />
        </label>

        <label className="grid gap-1.5 text-sm text-zinc-700">
          <span className="font-medium text-[var(--navy)]">Descrizione</span>
          <textarea
            required
            maxLength={2000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-32 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors ring-[var(--gold)]/30 placeholder:text-zinc-400 focus:border-[var(--gold)] focus:ring"
            placeholder="Descrivi il problema e i passaggi effettuati."
          />
        </label>

        <div className="grid gap-2 text-sm text-zinc-700">
          <span className="font-medium text-[var(--navy)]">Priorita</span>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
              <input
                type="radio"
                name="priority"
                value="normale"
                checked={priority === "normale"}
                onChange={() => setPriority("normale")}
              />
              Normale
            </label>
            <label className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
              <input
                type="radio"
                name="priority"
                value="urgente"
                checked={priority === "urgente"}
                onChange={() => setPriority("urgente")}
              />
              Urgente
            </label>
          </div>
        </div>

        <label className="inline-flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-3 py-2 text-xs text-zinc-700 sm:text-sm">
          <input
            type="checkbox"
            required
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-0.5"
          />
          Dichiaro di aver letto l&apos;informativa privacy e autorizzo il trattamento dei dati per gestire
          la richiesta di assistenza.
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-fit items-center rounded-lg bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[var(--navy)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--gold-light)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-65"
        >
          {submitting ? "Invio in corso..." : "Invia richiesta"}
        </button>

        {errorMessage ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-sm">
            {errorMessage}
          </p>
        ) : null}

        {successTicketId ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 sm:text-sm">
            Richiesta inviata correttamente. Codice pratica: <strong>{successTicketId}</strong>.
          </p>
        ) : null}
      </form>
    </section>
  );
}

