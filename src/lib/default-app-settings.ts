import type { AppSettings } from "./rules/types";

/** Valori predefiniti allineati a `getSettings()` quando non c’è DB (anteprima UI lato client). */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultReminderTime: "09:00",
  defaultReminderOffsets: [7],
  weekendHandling: undefined,
  holidays: undefined,
  defaultTimeForDeadlines: "08:00",
  defaultReminderOffsetsAtto: [7],
  notificaEsteroDefault: false,
  termineComparizioneCitazioneItalia: 120,
  termineComparizioneCitazioneEstero: 150,
  ferialeSuspensionStart: "08-01",
  ferialeSuspensionEnd: "08-31",
  italianHolidays: [],
};
