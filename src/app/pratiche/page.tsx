import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { AppShell } from "@/components/layout/AppShell";
import { PraticheView, type PracticeSummary } from "@/components/pratiche/PraticheView";
import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/db/user";
import { parseJsonField } from "@/lib/utils";

function toDateOnlyStringLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeMaybeDateOnlyStr(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim().length > 0) {
    const s = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const d = new Date(s);
    if (!isNaN(d.getTime())) return toDateOnlyStringLocal(d);
    return fallback;
  }
  return fallback;
}

function composePracticeTitle(parts: {
  parti?: unknown;
  rg?: unknown;
  autorita?: unknown;
  luogo?: unknown;
}): string {
  const parti = typeof parts.parti === "string" ? parts.parti : "";
  const rg = typeof parts.rg === "string" ? parts.rg : "";
  const autorita = typeof parts.autorita === "string" ? parts.autorita : "";
  const luogo = typeof parts.luogo === "string" ? parts.luogo : "";
  return [parti, rg, autorita, luogo].map((v) => v.trim()).filter((v) => v.length > 0).join(" - ");
}

async function getPracticesForCurrentUser(): Promise<PracticeSummary[]> {
  const user = await getOrCreateDbUser();

  const events = await prisma.event.findMany({
    where: {
      userId: user.id,
      macroType: "ATTO_GIURIDICO",
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      startAt: true,
      status: true,
      inputs: true,
    },
  });

  const out: PracticeSummary[] = [];

  for (const e of events) {
    const inputsParsed = parseJsonField(e.inputs);
    if (!inputsParsed) continue;

    const practiceIdentity = inputsParsed.practiceIdentity as Record<string, unknown> | undefined;
    if (!practiceIdentity) continue;

    const practiceTitle = composePracticeTitle({
      parti: practiceIdentity.parti,
      rg: practiceIdentity.rg,
      autorita: practiceIdentity.autorita,
      luogo: practiceIdentity.luogo,
    });

    if (!practiceTitle) continue;

    const fallbackPracticeDate = toDateOnlyStringLocal(e.startAt);
    const practiceIdentityDate = normalizeMaybeDateOnlyStr(inputsParsed.practiceIdentityDate, fallbackPracticeDate);
    const anchorDate = toDateOnlyStringLocal(e.startAt);

    out.push({
      id: e.id,
      practiceTitle,
      practiceIdentityDate,
      anchorPhaseTitle: e.title,
      anchorDate,
      status: (e.status ?? "pending") as PracticeSummary["status"],
    });
  }

  // Sort: date pratica desc, poi titolo.
  out.sort((a, b) => {
    if (a.practiceIdentityDate !== b.practiceIdentityDate) return b.practiceIdentityDate.localeCompare(a.practiceIdentityDate);
    return a.practiceTitle.localeCompare(b.practiceTitle);
  });

  return out;
}

export default async function PratichePage() {
  let practices: PracticeSummary[] = [];
  try {
    practices = await getPracticesForCurrentUser();
  } catch {
    practices = [];
  }

  return (
    <>
      <SignedIn>
        <AppShell>
          <PraticheView practices={practices} />
        </AppShell>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-[var(--surface)] flex flex-col items-center justify-center gap-4 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[var(--navy)]">Accedi per vedere le pratiche</h1>
            <p className="mt-2 text-sm text-zinc-600">Le pratiche sono disponibili solo dopo il login.</p>
          </div>
          <SignInButton mode="modal">
            <button className="rounded-md border border-[var(--gold)] px-4 py-2 text-sm font-medium text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors">
              Accedi
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}

