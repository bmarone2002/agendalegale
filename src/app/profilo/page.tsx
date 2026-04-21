"use client";

import { useEffect, useMemo, useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { AppShell } from "@/components/layout/AppShell";

type BillingCycle = "monthly" | "yearly";
type SubscriptionStatus = "free" | "trialing" | "active" | "past_due" | "canceled";

type BillingStatusData = {
  currentPlan: string;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  trialEndsAt: string | null;
  trialExpired: boolean;
  isTester: boolean;
  planOverride: string | null;
  hasPremiumAccess: boolean;
};

type DiagnosticData = {
  stripeReachable: boolean;
  stripeAccountId: string;
  stripeMode: "test" | "live_or_unknown";
  webhookConfigured: boolean;
  monthlyPriceConfigured: boolean;
  yearlyPriceConfigured: boolean;
  monthlyPriceLooksValid: boolean;
  yearlyPriceLooksValid: boolean;
};

export default function ProfilePage() {
  return (
    <AppShell headerTitle={<span>Il mio profilo</span>}>
      <SignedIn>
        <ProfilePanel />
      </SignedIn>
      <SignedOut>
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-[var(--navy)]">Accedi per vedere il tuo profilo</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Entra con il tuo account per gestire piano, pagamenti e impostazioni personali.
          </p>
          <SignInButton mode="redirect">
            <button className="mt-5 rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">
              Vai al login
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </AppShell>
  );
}

function ProfilePanel() {
  const { user } = useUser();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [status, setStatus] = useState<BillingStatusData | null>(null);
  const [diag, setDiag] = useState<DiagnosticData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingDiag, setLoadingDiag] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullName = useMemo(() => {
    const first = user?.firstName ?? "";
    const last = user?.lastName ?? "";
    const combined = `${first} ${last}`.trim();
    return combined.length > 0 ? combined : "Utente";
  }, [user]);

  const statusInfo = useMemo(() => {
    if (!status) {
      return { label: "Non disponibile", badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200" };
    }
    switch (status.subscriptionStatus) {
      case "active":
        return { label: "Attivo", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "trialing":
        return { label: "In prova", badgeClass: "bg-sky-100 text-sky-800 border-sky-200" };
      case "past_due":
        return { label: "Pagamento in ritardo", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" };
      case "canceled":
        return { label: "Annullato", badgeClass: "bg-rose-100 text-rose-800 border-rose-200" };
      default:
        return { label: "Free", badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200" };
    }
  }, [status]);

  useEffect(() => {
    void loadBillingStatus();
  }, []);

  async function loadBillingStatus() {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/billing/status");
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Errore caricamento profilo billing");
      }
      setStatus(json.data as BillingStatusData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore inatteso");
    } finally {
      setLoadingStatus(false);
    }
  }

  async function openCheckout() {
    setLoadingCheckout(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingCycle, trialDays: 30 }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success || !json?.data?.checkoutUrl) {
        throw new Error(json?.error ?? "Errore creazione checkout");
      }
      window.location.href = json.data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore inatteso");
    } finally {
      setLoadingCheckout(false);
    }
  }

  async function openPortal() {
    setLoadingPortal(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json?.success || !json?.data?.portalUrl) {
        throw new Error(json?.error ?? "Errore apertura customer portal");
      }
      window.location.href = json.data.portalUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore inatteso");
    } finally {
      setLoadingPortal(false);
    }
  }

  async function runDiagnostics() {
    setLoadingDiag(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/test-mode");
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Errore diagnostica Stripe");
      }
      setDiag(json.data as DiagnosticData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore inatteso");
    } finally {
      setLoadingDiag(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Area Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--navy)]">Il mio profilo</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Gestisci dati account, stato abbonamento e strumenti di pagamento in un unico pannello.
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--navy)]">Dati account</h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            <p><span className="font-medium">Nome:</span> {fullName}</p>
            <p><span className="font-medium">Email:</span> {user?.primaryEmailAddress?.emailAddress ?? "-"}</p>
            <p>
              <span className="font-medium">Profilo creato:</span>{" "}
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("it-IT") : "-"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--navy)]">Stato abbonamento</h2>
          {loadingStatus ? (
            <p className="mt-3 text-sm text-zinc-500">Caricamento stato in corso...</p>
          ) : status ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Piano" value={status.currentPlan.toUpperCase()} />
              <StatBadgeCard label="Stato" value={statusInfo.label} badgeClass={statusInfo.badgeClass} />
              <StatCard label="Premium" value={status.hasPremiumAccess ? "SI" : "NO"} />
              <StatCard label="Tester" value={status.isTester ? "SI" : "NO"} />
              <div className="sm:col-span-2 lg:col-span-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                <span className="font-medium">Fine trial:</span>{" "}
                {status.trialEndsAt ? new Date(status.trialEndsAt).toLocaleString("it-IT") : "-"}
              </div>
              {status.planOverride && (
                <div className="sm:col-span-2 lg:col-span-4 rounded-lg border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-3 py-2 text-sm text-[var(--navy)]">
                  <span className="font-medium">Override piano:</span> {status.planOverride}
                </div>
              )}
              <p>
                <span className="font-medium">Customer Stripe:</span> {status.stripeCustomerId ? "Configurato" : "Non configurato"}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">Stato non disponibile.</p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--navy)]">Pagamenti</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Avvia un nuovo checkout oppure apri il portale cliente per gestire il piano attivo.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-zinc-700" htmlFor="billingCycle">
            Ciclo:
          </label>
          <select
            id="billingCycle"
            value={billingCycle}
            onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="monthly">Mensile</option>
            <option value="yearly">Annuale</option>
          </select>
          <button
            onClick={openCheckout}
            disabled={loadingCheckout}
            className="rounded-md bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--navy)] disabled:opacity-60"
          >
            {loadingCheckout ? "Apro checkout..." : "Attiva o rinnova piano"}
          </button>
          <button
            onClick={openPortal}
            disabled={loadingPortal}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-60"
          >
            {loadingPortal ? "Apro portale..." : "Gestisci abbonamento"}
          </button>
        </div>
      </div>

      <details className="mt-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--navy)]">
          Strumenti tecnici Stripe (admin)
        </summary>
        <p className="mt-2 text-sm text-zinc-600">
          Verifica rapida della configurazione Stripe in ambiente corrente.
        </p>
        <button
          onClick={runDiagnostics}
          disabled={loadingDiag}
          className="mt-3 rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loadingDiag ? "Verifica in corso..." : "Verifica configurazione Stripe"}
        </button>
        {diag && (
          <div className="mt-3 space-y-1 text-sm text-zinc-700">
            <p>Account Stripe: {diag.stripeAccountId}</p>
            <p>Modalita': {diag.stripeMode}</p>
            <p>Webhook secret presente: {diag.webhookConfigured ? "SI" : "NO"}</p>
            <p>Price monthly configurato: {diag.monthlyPriceConfigured ? "SI" : "NO"}</p>
            <p>Price yearly configurato: {diag.yearlyPriceConfigured ? "SI" : "NO"}</p>
          </div>
        )}
      </details>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {toFriendlyError(error)}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[var(--navy)]">{value}</p>
    </div>
  );
}

function StatBadgeCard({
  label,
  value,
  badgeClass,
}: {
  label: string;
  value: string;
  badgeClass: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
        {value}
      </span>
    </div>
  );
}

function toFriendlyError(message: string): string {
  if (message.includes("Can't reach database server")) {
    return "Connessione al database non disponibile in questo ambiente. Controlla le variabili DATABASE_URL/.env.local oppure usa l'ambiente Railway.";
  }
  return message;
}
