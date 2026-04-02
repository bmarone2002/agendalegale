import type { Event } from "@/types";

/**
 * Titolo «pratica» (parti, RG, autorità, luogo) da `inputs.practiceIdentity`, con fallback sul campo `title`
 * per eventi non Atto giuridico o dati legacy.
 */
export function getPracticeTitleFromEvent(e: Pick<Event, "title" | "inputs">): string {
  const inputs = e.inputs as Record<string, unknown> | null | undefined;
  const pi = inputs?.practiceIdentity as Record<string, unknown> | undefined;
  if (pi && typeof pi === "object") {
    const parti = typeof pi.parti === "string" ? pi.parti : "";
    const rg = typeof pi.rg === "string" ? pi.rg : "";
    const autorita = typeof pi.autorita === "string" ? pi.autorita : "";
    const luogo = typeof pi.luogo === "string" ? pi.luogo : "";
    const composed = [parti, rg, autorita, luogo]
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
      .join(" - ");
    if (composed) return composed;
  }
  return (e.title ?? "").trim();
}
