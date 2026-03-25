import type { ExcelRuleRow } from "@/lib/rules/excel-import";
import { fromExcelJson } from "@/lib/rules/excel-import";
import { registerEventRules } from "@/types/macro-areas";

const RICORSO_LAVORO_ROWS: ExcelRuleRow[] = [
  // ── Introduzione ────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "RICORSO_LAVORO",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Deposito del Ricorso",
    eventoCode: "DEPOSITO_RICORSO_LAVORO",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Artt. 409 e 414 c.p.c.",
    noteOperative:
      "Data di inserimento manuale. Evento iniziale del procedimento in materia di lavoro.",
    ordine: 1,
  },
  {
    macroArea: "LAVORO",
    procedimento: "RICORSO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Decreto fissazione udienza",
    eventoCode: "DECRETO_FISSAZIONE_UDIENZA_RICORSO_LAVORO",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 415 c.p.c.",
    noteOperative:
      "Data di inserimento manuale da cui partono i termini per la notifica del ricorso e del decreto.",
    ordine: 2,
  },
  {
    macroArea: "LAVORO",
    procedimento: "RICORSO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Data Udienza",
    eventoCode: "DATA_UDIENZA_RICORSO_LAVORO",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 415 c.p.c.",
    noteOperative:
      "Data di inserimento manuale usata per calcolare il termine di costituzione del convenuto.",
    ordine: 3,
  },

  // ── Notifiche ───────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "RICORSO_LAVORO",
    parteProcessuale: "ATTORE", // Ricorrente
    eventoLabel: "Notifica Ricorso e Decreto",
    eventoCode: "NOTIFICA_RICORSO_DECRETO_RICORSO_LAVORO",
    eventoBaseKey: "dataEmissioneDecretoFissazioneUdienzaRicorsoLavoro",
    direzioneCalcolo: "+",
    numero: 10,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 415 c.p.c.",
    noteOperative:
      "Termine perentorio per il ricorrente: entro 10 giorni dalla data di emissione del decreto.",
    ordine: 4,
  },

  // ── Costituzione ────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "RICORSO_LAVORO",
    parteProcessuale: "CONVENUTO", // Convenuto
    eventoLabel: "Costituzione del Convenuto",
    eventoCode: "COSTITUZIONE_CONVENUTO_RICORSO_LAVORO",
    eventoBaseKey: "dataUdienzaRicorsoLavoro",
    direzioneCalcolo: "-",
    numero: 10,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 416 c.p.c.",
    noteOperative:
      "Termine perentorio: almeno 10 giorni prima della data dell'udienza.",
    ordine: 5,
  },

  // ── Prosecuzione ────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "RICORSO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel: "Prosecuzione manuale",
    eventoCode: "PROSECUZIONE_MANUALE_RICORSO_LAVORO",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: null,
    noteOperative:
      "Dopo questi eventi il procedimento prosegue manualmente secondo lo sviluppo concreto della causa.",
    ordine: 6,
  },

  // ── Sentenza ────────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "RICORSO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel:
      "Data pubblicazione Sentenza con calcolo termine lungo per Appello",
    eventoCode: "PUBBLICAZIONE_SENTENZA_TERMINE_LUNGO_APPELLO_RICORSO_LAVORO",
    eventoBaseKey: "dataPubblicazioneSentenzaRicorsoLavoro",
    direzioneCalcolo: "+",
    numero: 6,
    unita: "mesi",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 327 c.p.c.",
    noteOperative:
      "Data di inserimento manuale utile per il calcolo del termine lungo per l'appello.",
    ordine: 7,
  },
  {
    macroArea: "LAVORO",
    procedimento: "RICORSO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel:
      "Data notificazione Sentenza per calcolo termine breve per Appello",
    eventoCode: "NOTIFICA_SENTENZA_TERMINE_BREVE_APPELLO_RICORSO_LAVORO",
    eventoBaseKey: "dataNotificaSentenzaRicorsoLavoro",
    direzioneCalcolo: "+",
    numero: 30,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 326 c.p.c.",
    noteOperative:
      "Data di inserimento manuale utile per il calcolo del termine breve di 30 giorni per l'appello.",
    ordine: 8,
  },
];

const APPELLO_LAVORO_ROWS: ExcelRuleRow[] = [
  // ── Introduzione ────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "APPELLO_LAVORO",
    parteProcessuale: "ATTORE", // Appellante
    eventoLabel: "Deposito del Ricorso in Appello",
    eventoCode: "DEPOSITO_RICORSO_APPELLO_LAVORO",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 434 c.p.c.",
    noteOperative:
      "Data inserita manualmente. Evento iniziale del procedimento di appello in materia di lavoro.",
    ordine: 1,
  },
  {
    macroArea: "LAVORO",
    procedimento: "APPELLO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel: "DATA COMUNICAZIONE DECRETO Fissazione dell'Udienza di Discussione",
    eventoCode: "DATA_COMUNICAZIONE_DECRETO_UDIENZA_APPELLO_LAVORO",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 435 c.p.c.",
    noteOperative:
      "Data di inserimento manuale da cui decorre il termine perentorio per la notificazione del ricorso e del decreto all'appellato.",
    ordine: 2,
  },
  {
    macroArea: "LAVORO",
    procedimento: "APPELLO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel: "DATA UDIENZA",
    eventoCode: "DATA_UDIENZA_APPELLO_LAVORO",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: "Art. 435 c.p.c.",
    noteOperative:
      "Data di inserimento manuale usata per calcolare i termini per la notificazione e per la costituzione dell'appellato.",
    ordine: 3,
  },

  // ── Notifiche ───────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "APPELLO_LAVORO",
    parteProcessuale: "ATTORE", // Appellante
    eventoLabel: "Notificazione del Ricorso e del Decreto",
    eventoCode: "NOTIFICA_RICORSO_DECRETO_APPELLO_LAVORO_10GG",
    eventoBaseKey: "dataComunicazioneDecretoFissazioneUdienzaAppelloLavoro",
    direzioneCalcolo: "+",
    numero: 10,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 435 c.p.c.",
    noteOperative:
      "Termine perentorio: il ricorso e il decreto devono essere notificati entro 10 giorni dalla data di comunicazione del decreto. Inoltre la notificazione deve rispettare anche il termine minimo di 25 giorni prima della data di udienza.",
    ordine: 4,
  },
  {
    macroArea: "LAVORO",
    procedimento: "APPELLO_LAVORO",
    parteProcessuale: "ATTORE", // Appellante
    eventoLabel:
      "Notificazione del Ricorso e del Decreto - rispetto termine minimo prima udienza",
    eventoCode: "NOTIFICA_RICORSO_DECRETO_APPELLO_LAVORO_25GG",
    eventoBaseKey: "dataUdienzaAppelloLavoro",
    direzioneCalcolo: "-",
    numero: 25,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 435 c.p.c.",
    noteOperative:
      "Vincolo ulteriore: la notificazione deve avvenire almeno 25 giorni prima della data di udienza. Questo controllo va letto insieme al termine dei 10 giorni dalla comunicazione del decreto.",
    ordine: 5,
  },

  // ── Costituzione ────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "APPELLO_LAVORO",
    parteProcessuale: "CONVENUTO", // Appellato
    eventoLabel: "COSTITUZIONE DELL'APPELLATO",
    eventoCode: "COSTITUZIONE_APPELLATO_APPELLO_LAVORO",
    eventoBaseKey: "dataUdienzaAppelloLavoro",
    direzioneCalcolo: "-",
    numero: 10,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 436 c.p.c.",
    noteOperative:
      "Termine perentorio: almeno 10 giorni prima della data dell'udienza.",
    ordine: 6,
  },

  // ── Prosecuzione ────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "APPELLO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel: "PROSECUZIONE MANUALE",
    eventoCode: "PROSECUZIONE_MANUALE_APPELLO_LAVORO",
    eventoBaseKey: null,
    direzioneCalcolo: null,
    numero: null,
    unita: null,
    tipoTermine: "manuale",
    isTermine: false,
    isSospensioneFeriale: false,
    isPromemoriaFestivi: false,
    norma: null,
    noteOperative:
      "Dopo questi eventi il procedimento prosegue manualmente secondo lo sviluppo concreto della causa.",
    ordine: 7,
  },

  // ── Sentenza ────────────────────────────────────────────────────────────
  {
    macroArea: "LAVORO",
    procedimento: "APPELLO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel:
      "Data pubblicazione Sentenza con calcolo termine lungo per Ricorso in Cassazione",
    eventoCode: "PUBBLICAZIONE_SENTENZA_RIC_CASS_LUNGO_APPELLO_LAVORO",
    eventoBaseKey: "dataPubblicazioneSentenzaAppelloLavoro",
    direzioneCalcolo: "+",
    numero: 6,
    unita: "mesi",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 327 c.p.c.",
    noteOperative:
      "Data di inserimento manuale utile per il calcolo del termine lungo per il ricorso in Cassazione.",
    ordine: 8,
  },
  {
    macroArea: "LAVORO",
    procedimento: "APPELLO_LAVORO",
    parteProcessuale: "COMUNE",
    eventoLabel:
      "Data notificazione Sentenza per calcolo termine breve per Ricorso in Cassazione",
    eventoCode: "NOTIFICA_SENTENZA_RIC_CASS_BREVE_APPELLO_LAVORO",
    eventoBaseKey: "dataNotificaSentenzaAppelloLavoro",
    direzioneCalcolo: "+",
    numero: 60,
    unita: "giorni",
    tipoTermine: "perentorio",
    isTermine: true,
    isSospensioneFeriale: true,
    isPromemoriaFestivi: true,
    norma: "Art. 326 c.p.c.",
    noteOperative:
      "Data di inserimento manuale utile per il calcolo del termine breve per il ricorso in Cassazione.",
    ordine: 9,
  },
];

const { eventRules: RICORSO_LAVORO_RULES } = fromExcelJson(RICORSO_LAVORO_ROWS);
const { eventRules: APPELLO_LAVORO_RULES } = fromExcelJson(APPELLO_LAVORO_ROWS);

registerEventRules(RICORSO_LAVORO_RULES);
registerEventRules(APPELLO_LAVORO_RULES);

export { RICORSO_LAVORO_RULES, APPELLO_LAVORO_RULES };

