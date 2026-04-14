import { getEventoByCode } from "@/types/macro-areas";
import { computePhase1MainDueAt } from "./rules/plugins/data-driven-engine";
import type { AppSettings } from "./rules/types";

/** Compute phase-1 title + startAt/endAt override for data-driven atto giuridico. */
export function computePhase1Overrides(params: {
  macroType?: string | null;
  ruleTemplateId?: string | null;
  eventoCode?: string | null;
  macroArea?: string | null;
  procedimento?: string | null;
  parteProcessuale?: string | null;
  inputs?: Record<string, unknown> | null;
  settings: AppSettings;
}): { title?: string; startAt?: Date; endAt?: Date } | null {
  const { macroType, ruleTemplateId, eventoCode, macroArea, procedimento, parteProcessuale, inputs, settings } = params;
  if (
    macroType !== "ATTO_GIURIDICO" ||
    ruleTemplateId !== "data-driven" ||
    !eventoCode || !macroArea || !procedimento || !parteProcessuale || !inputs
  ) {
    return null;
  }

  const dueAt = computePhase1MainDueAt({
    macroArea: macroArea as any,
    procedimento: procedimento as any,
    parteProcessuale: parteProcessuale as any,
    eventoCode,
    inputs,
    settings,
  });

  const ev = getEventoByCode(procedimento as any, eventoCode);
  const title = ev?.label ?? eventoCode;

  if (!dueAt) return { title };
  return { title, startAt: dueAt, endAt: new Date(dueAt.getTime() + 60 * 60 * 1000) };
}
