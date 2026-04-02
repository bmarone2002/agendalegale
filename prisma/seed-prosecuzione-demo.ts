/**
 * Crea un evento di prova per testare il tab Prosecuzione in locale.
 *
 * Uso:
 *   npm run db:seed:prosecuzione
 *   oppure: LOCAL_DEV_CLERK_USER_ID=user_xxxxx npm run db:seed:prosecuzione
 *
 * Legge DATABASE_URL da .env.local o .env (come il dev server).
 * Se non imposti LOCAL_DEV_CLERK_USER_ID, usa l'ultimo utente nel DB (dopo un login Clerk).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnvFiles(): void {
  for (const name of [".env.local", ".env"]) {
    const p = resolve(process.cwd(), name);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq <= 0) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!key || /\s/.test(key)) continue;
      if (process.env[key] == null || process.env[key] === "") {
        process.env[key] = val;
      }
    }
  }
}

loadDotEnvFiles();

const DEMO_EVENT_ID = "local_demo_prosecuzione_evt";

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error(
      "DATABASE_URL non trovata. Aggiungila in .env.local (o .env) nella root del progetto, come per `npm run dev`.",
    );
    process.exit(1);
  }

  const { PrismaClient } = await import("../src/generated/prisma");
  const prisma = new PrismaClient();

  let clerkUserId = process.env.LOCAL_DEV_CLERK_USER_ID?.trim() || process.argv[2];
  if (!clerkUserId) {
    const latest = await prisma.user.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!latest) {
      console.error(
        "Nessun utente nel database. Accedi una volta all'app con Clerk, oppure imposta LOCAL_DEV_CLERK_USER_ID nel .env.local",
      );
      process.exit(1);
    }
    clerkUserId = latest.clerkUserId;
    console.log("Uso l'ultimo utente nel DB (clerkUserId):", clerkUserId);
  }

  const user = await prisma.user.upsert({
    where: { clerkUserId },
    create: { clerkUserId, email: "prosecuzione-demo@local.test" },
    update: {},
  });

  await prisma.rinvio.deleteMany({ where: { parentEventId: DEMO_EVENT_ID } });
  await prisma.subEvent.deleteMany({ where: { parentEventId: DEMO_EVENT_ID } });
  await prisma.event.deleteMany({ where: { id: DEMO_EVENT_ID } });

  const startAt = new Date();
  startAt.setDate(startAt.getDate() + 14);
  startAt.setHours(9, 0, 0, 0);
  const endAt = new Date(startAt);
  endAt.setHours(10, 0, 0, 0);

  await prisma.event.create({
    data: {
      id: DEMO_EVENT_ID,
      userId: user.id,
      title: "Rossi / Bianchi – RG 1000/2026 [TEST prosecuzione]",
      description: "Pratica di prova (seed prisma/seed-prosecuzione-demo.ts) per il tab Prosecuzione.",
      startAt,
      endAt,
      type: "altro",
      tags: "[]",
      generateSubEvents: true,
      ruleTemplateId: "data-driven",
      ruleParams: "{}",
      macroType: "ATTO_GIURIDICO",
      macroArea: "CIVILE_CONTENZIOSO",
      procedimento: "CITAZIONE_CIVILE",
      parteProcessuale: "ATTORE",
      eventoCode: "MEMORIA_171TER_3",
      inputs: JSON.stringify({
        dataPrimaNotificaCitazione: "2026-01-15",
        dataPrimaUdienza: "2026-04-10",
      }),
      status: "pending",
    },
  });

  console.log("\nOK — evento demo creato.");
  console.log("  id:", DEMO_EVENT_ID);
  console.log('  titolo: contiene "[TEST prosecuzione]"');
  console.log(
    "Apri il calendario, seleziona la pratica → tab «Prosecuzione» (evento già salvato).\n",
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
