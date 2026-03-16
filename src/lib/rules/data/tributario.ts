import type { ExcelRuleRow } from "@/lib/rules/excel-import";
import { fromExcelJson } from "@/lib/rules/excel-import";
import { registerEventRules } from "@/types/macro-areas";

// ── Ricorso tributario – assetto vigente post riforma ────────────────────────

const RICORSO_TRIBUTARIO_ROWS: ExcelRuleRow[] = [
  {
    macroArea: "TRIBUTARIO",
    procedimento: "RICORSO_TRIBUTARIO",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Notifica ricorso/appello",
    eventoCode: "NOTIFICA_RICORSO_TRIBUTARIO",
    eventoBaseKey: "dataNotificaAttoImpugnatoTrib",
    direzioneCalcolo: "+",
    numero: 60,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 21 D.Lgs. 546/1992",
    noteOperative:
      "Per il ricorso di primo grado il ricorso va proposto entro 60 giorni dalla notificazione dell'atto impugnato.",
    ordine: 1,
  },
  {
    macroArea: "TRIBUTARIO",
    procedimento: "RICORSO_TRIBUTARIO",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Deposito ricorso/appello",
    eventoCode: "DEPOSITO_RICORSO_TRIBUTARIO",
    eventoBaseKey: "dataProposizioneRicorsoTrib",
    direzioneCalcolo: "+",
    numero: 30,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 22 D.Lgs. 546/1992",
    noteOperative:
      "Il ricorrente si costituisce depositando il ricorso entro 30 giorni dalla proposizione/notifica; la regola è a pena di inammissibilità.",
    ordine: 2,
  },
  {
    macroArea: "TRIBUTARIO",
    procedimento: "RICORSO_TRIBUTARIO",
    parteProcessuale: "CONVENUTO", // Ente resistente
    eventoLabel: "Costituzione ente",
    eventoCode: "COSTITUZIONE_ENTE_TRIBUTARIO",
    eventoBaseKey: "dataRicezioneRicorsoEnteTrib",
    direzioneCalcolo: "+",
    numero: 60,
    unita: "giorni",
    tipoTermine: "ordinatorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 23 D.Lgs. 546/1992",
    noteOperative:
      "L'ente resistente si costituisce entro 60 giorni dal giorno in cui il ricorso è stato notificato, consegnato o ricevuto.",
    ordine: 3,
  },
  {
    macroArea: "TRIBUTARIO",
    procedimento: "RICORSO_TRIBUTARIO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Udienza sospensiva",
    eventoCode: "UDIENZA_SOSPENSIVA_TRIBUTARIO",
    eventoBaseKey: "dataIstanzaCautelareTrib",
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 47 D.Lgs. 546/1992",
    noteOperative:
      "Udienza cautelare da gestire come evento manuale, perché dipende dalla richiesta di sospensione e dalla fissazione della Corte di giustizia tributaria.",
    ordine: 4,
  },
  {
    macroArea: "TRIBUTARIO",
    procedimento: "RICORSO_TRIBUTARIO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Udienza trattazione",
    eventoCode: "UDIENZA_TRATTAZIONE_TRIBUTARIO",
    eventoBaseKey: "dataUdienzaTrattazioneTrib",
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Artt. 31 e 33 D.Lgs. 546/1992",
    noteOperative:
      "Data ancora del procedimento tributario: da questa si calcolano le memorie a ritroso.",
    ordine: 5,
  },
  {
    macroArea: "TRIBUTARIO",
    procedimento: "RICORSO_TRIBUTARIO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Deposito memorie 20 gg",
    eventoCode: "DEPOSITO_MEMORIE_20_TRIBUTARIO",
    eventoBaseKey: "dataUdienzaTrattazioneTrib",
    direzioneCalcolo: "-",
    numero: 20,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 32 D.Lgs. 546/1992",
    noteOperative:
      "Le parti possono depositare documenti fino a 20 giorni liberi prima della data di trattazione.",
    ordine: 6,
  },
  {
    macroArea: "TRIBUTARIO",
    procedimento: "RICORSO_TRIBUTARIO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Deposito memorie 10 gg",
    eventoCode: "DEPOSITO_MEMORIE_10_TRIBUTARIO",
    eventoBaseKey: "dataUdienzaTrattazioneTrib",
    direzioneCalcolo: "-",
    numero: 10,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 32 D.Lgs. 546/1992",
    noteOperative:
      "Le parti possono depositare memorie illustrative fino a 10 giorni liberi prima della data di trattazione.",
    ordine: 7,
  },
  {
    macroArea: "TRIBUTARIO",
    procedimento: "RICORSO_TRIBUTARIO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Sentenza (per calcolare termini appello/Ric Cassazione)",
    eventoCode: "SENTENZA_RICORSO_TRIBUTARIO",
    eventoBaseKey: "dataPubblicazioneSentenzaTrib",
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Artt. 38, 51 e 62 D.Lgs. 546/1992",
    noteOperative:
      "Data base per il termine lungo dell'appello o del ricorso per cassazione. Va inserita manualmente.",
    ordine: 8,
  },
  {
    macroArea: "TRIBUTARIO",
    procedimento: "RICORSO_TRIBUTARIO",
    parteProcessuale: "COMUNE",
    eventoLabel:
      "Notifica Sentenza (per calcolare termini appello/Ric Cassazione)",
    eventoCode: "NOTIFICA_SENTENZA_RICORSO_TRIBUTARIO",
    eventoBaseKey: "dataNotificaSentenzaTrib",
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Artt. 38, 51 e 62 D.Lgs. 546/1992",
    noteOperative:
      "Data base per il termine breve di impugnazione: dalla notifica decorrono i termini per appello o ricorso per cassazione, secondo il grado.",
    ordine: 9,
  },
];

const { eventRules: RICORSO_TRIBUTARIO_RULES } = fromExcelJson(
  RICORSO_TRIBUTARIO_ROWS,
);

registerEventRules(RICORSO_TRIBUTARIO_RULES);

export { RICORSO_TRIBUTARIO_RULES };

