import type { ExcelRuleRow } from "@/lib/rules/excel-import";
import { fromExcelJson } from "@/lib/rules/excel-import";
import { registerEventRules } from "@/types/macro-areas";

// ── Cassazione – post Riforma Cartabia ───────────────────────────────────────
// Nota: i procedimenti sono due (RICORSO_CASSAZIONE / CONTRORICORSO) ma la logica
// è sostanzialmente la stessa; cambia la parte processuale che attiva le righe.

const RICORSO_CASSAZIONE_ROWS: ExcelRuleRow[] = [
  {
    macroArea: "CASSAZIONE",
    procedimento: "RICORSO_CASSAZIONE",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Notifica Ricorso per Cassazione",
    eventoCode: "NOTIFICA_RICORSO_CASS_BREVE",
    eventoBaseKey: "dataNotificaSentenzaImpugnareCass",
    direzioneCalcolo: "+",
    numero: 60,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 325 c.p.c., comma 2",
    noteOperative:
      "Termine breve: il ricorso per cassazione va notificato entro 60 giorni dalla notifica della sentenza. Se la sentenza non è notificata, opera il termine lungo di 6 mesi dalla pubblicazione.",
    ordine: 1,
  },
  {
    macroArea: "CASSAZIONE",
    procedimento: "RICORSO_CASSAZIONE",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Notifica Ricorso per Cassazione",
    eventoCode: "NOTIFICA_RICORSO_CASS_LUNGO",
    eventoBaseKey: "dataPubblicazioneSentenzaImpugnareCass",
    direzioneCalcolo: "+",
    numero: 6,
    unita: "mesi",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 327 c.p.c.",
    noteOperative:
      "Termine lungo: il ricorso per cassazione va notificato entro 6 mesi dalla pubblicazione della sentenza se la sentenza non è notificata.",
    ordine: 2,
  },
  {
    macroArea: "CASSAZIONE",
    procedimento: "RICORSO_CASSAZIONE",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Deposito Ricorso",
    eventoCode: "DEPOSITO_RICORSO_CASS",
    eventoBaseKey: "dataUltimaNotificaRicorsoCass",
    direzioneCalcolo: "+",
    numero: 20,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 369 c.p.c.",
    noteOperative:
      "Il ricorso è depositato, a pena di improcedibilità, entro 20 giorni dall'ultima notificazione.",
    ordine: 3,
  },
  {
    macroArea: "CASSAZIONE",
    procedimento: "RICORSO_CASSAZIONE",
    parteProcessuale: "COMUNE",
    eventoLabel: "Proposta 380 bis",
    eventoCode: "PROPOSTA_380BIS",
    eventoBaseKey: "dataComunicazioneProposta380bis",
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 380-bis c.p.c.",
    noteOperative:
      "Evento manuale: la proposta di definizione accelerata è comunicata ai difensori dalla Corte di cassazione nei casi previsti dalla norma.",
    ordine: 4,
  },
  {
    macroArea: "CASSAZIONE",
    procedimento: "RICORSO_CASSAZIONE",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Istanza per Decisione 380 bis c. 2",
    eventoCode: "ISTANZA_DECISIONE_380BIS",
    eventoBaseKey: "dataComunicazioneProposta380bis",
    direzioneCalcolo: "+",
    numero: 40,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 380-bis c.p.c.",
    noteOperative:
      "Entro 40 giorni dalla comunicazione, il ricorrente può chiedere la decisione con istanza sottoscritta dal difensore munito di nuova procura speciale.",
    ordine: 5,
  },
  {
    macroArea: "CASSAZIONE",
    procedimento: "RICORSO_CASSAZIONE",
    parteProcessuale: "COMUNE",
    eventoLabel: "Memorie ex art. 378",
    eventoCode: "MEMORIE_378",
    eventoBaseKey: "dataUdienzaCass",
    direzioneCalcolo: "-",
    numero: 10,
    unita: "giorni",
    tipoTermine: "ordinatorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 378 c.p.c.",
    noteOperative:
      "Le parti possono depositare sintetiche memorie illustrative almeno 10 giorni prima dell'udienza. Il termine è a ritroso e non libero.",
    ordine: 6,
  },
  {
    macroArea: "CASSAZIONE",
    procedimento: "RICORSO_CASSAZIONE",
    parteProcessuale: "COMUNE",
    eventoLabel: "Udienza",
    eventoCode: "UDIENZA_CASS",
    eventoBaseKey: "dataUdienzaCass",
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Artt. 377 e 378 c.p.c.",
    noteOperative: "Data fissata dalla Corte per udienza pubblica o altra trattazione.",
    ordine: 7,
  },
];

const CONTRORICORSO_ROWS: ExcelRuleRow[] = [
  {
    macroArea: "CASSAZIONE",
    procedimento: "CONTRORICORSO",
    parteProcessuale: "CONVENUTO", // Controricorrente
    eventoLabel: "Deposito Controricorso",
    eventoCode: "DEPOSITO_CONTRORICORSO",
    eventoBaseKey: "dataNotificaRicorsoCass",
    direzioneCalcolo: "+",
    numero: 40,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 370 c.p.c.",
    noteOperative:
      "Il controricorso è depositato entro 40 giorni dalla notificazione del ricorso.",
    ordine: 1,
  },
  {
    macroArea: "CASSAZIONE",
    procedimento: "CONTRORICORSO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Proposta 380 bis",
    eventoCode: "PROPOSTA_380BIS",
    eventoBaseKey: "dataComunicazioneProposta380bis",
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 380-bis c.p.c.",
    noteOperative:
      "Evento manuale: la proposta di definizione accelerata è comunicata ai difensori dalla Corte di cassazione nei casi previsti dalla norma.",
    ordine: 2,
  },
  {
    macroArea: "CASSAZIONE",
    procedimento: "CONTRORICORSO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Memorie ex art. 378",
    eventoCode: "MEMORIE_378",
    eventoBaseKey: "dataUdienzaCass",
    direzioneCalcolo: "-",
    numero: 10,
    unita: "giorni",
    tipoTermine: "ordinatorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 378 c.p.c.",
    noteOperative:
      "Le parti possono depositare sintetiche memorie illustrative almeno 10 giorni prima dell'udienza. Il termine è a ritroso e non libero.",
    ordine: 3,
  },
  {
    macroArea: "CASSAZIONE",
    procedimento: "CONTRORICORSO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Udienza",
    eventoCode: "UDIENZA_CASS",
    eventoBaseKey: "dataUdienzaCass",
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Artt. 377 e 378 c.p.c.",
    noteOperative: "Data fissata dalla Corte per udienza pubblica o altra trattazione.",
    ordine: 4,
  },
];

const { eventRules: RICORSO_CASSAZIONE_RULES } = fromExcelJson(
  RICORSO_CASSAZIONE_ROWS,
);
const { eventRules: CONTRORICORSO_RULES } = fromExcelJson(CONTRORICORSO_ROWS);

registerEventRules(RICORSO_CASSAZIONE_RULES);
registerEventRules(CONTRORICORSO_RULES);

export { RICORSO_CASSAZIONE_RULES, CONTRORICORSO_RULES };

