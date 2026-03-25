"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { EventStatus } from "@/types";
import { Input } from "@/components/ui/input";

export type PracticeSummary = {
  id: string;
  practiceTitle: string;
  practiceIdentityDate: string; // yyyy-MM-dd
  anchorPhaseTitle: string;
  anchorDate: string; // yyyy-MM-dd
  status: EventStatus;
};

function formatDateForHumans(dateOnly: string): string {
  // dateOnly expected: yyyy-MM-dd (or empty)
  if (!dateOnly) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    const [y, m, d] = dateOnly.split("-");
    return `${d}/${m}/${y}`;
  }
  return dateOnly;
}

export function PraticheView({ practices }: { practices: PracticeSummary[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return practices;
    return practices.filter((p) => {
      const blob = [p.practiceTitle, p.practiceIdentityDate, p.anchorPhaseTitle, p.anchorDate].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [practices, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-[var(--navy)]">Pratiche</h1>
        <p className="text-sm text-zinc-600">
          Riepilogo dei contenitori pratica. Cerca per parte, RG, autorità, luogo o per date.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca nella pratica…"
            className="h-10"
          />
        </div>
        <div className="text-xs text-zinc-500 sm:text-right">
          {filtered.length} pratica{filtered.length === 1 ? "" : "e"}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
          Nessuna pratica trovata.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/?eventId=${encodeURIComponent(p.id)}`}
              className="rounded-lg border border-zinc-200 bg-white p-3 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-[var(--navy)] truncate">{p.practiceTitle || "Pratica"}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Data pratica: <span className="font-medium">{formatDateForHumans(p.practiceIdentityDate)}</span> · Fase:{" "}
                    <span className="font-medium">{p.anchorPhaseTitle}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Anchor: {formatDateForHumans(p.anchorDate)}</div>
                </div>
                <div
                  className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-1 ${
                    p.status === "done" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.status === "done" ? "Completata" : "Da fare"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

