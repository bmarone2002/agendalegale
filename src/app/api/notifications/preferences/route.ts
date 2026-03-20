import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/db/user";

const preferenceSchema = z.object({
  eventType: z.string().nullable().optional(),
  macroArea: z.string().nullable().optional(),
  enabled: z.boolean().optional(),
  notifyHoursBefore: z.number().int().min(1).max(720).nullable().optional(),
});

const saveSchema = z.object({
  preferences: z.array(preferenceSchema).default([]),
});

export async function GET() {
  try {
    const user = await getOrCreateDbUser();
    const preferences = await prisma.eventNotificationPreference.findMany({
      where: { userId: user.id },
      orderBy: [{ eventType: "asc" }, { macroArea: "asc" }],
    });
    return NextResponse.json({ success: true, data: preferences });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore caricamento preferenze";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateDbUser();
    const payload = saveSchema.parse(await req.json());

    await prisma.$transaction(async (tx) => {
      await tx.eventNotificationPreference.deleteMany({
        where: { userId: user.id },
      });
      if (payload.preferences.length === 0) return;
      await tx.eventNotificationPreference.createMany({
        data: payload.preferences.map((pref) => ({
          userId: user.id,
          eventType: pref.eventType ?? null,
          macroArea: pref.macroArea ?? null,
          enabled: pref.enabled ?? true,
          notifyHoursBefore: pref.notifyHoursBefore ?? 24,
        })),
      });
    });

    const data = await prisma.eventNotificationPreference.findMany({
      where: { userId: user.id },
      orderBy: [{ eventType: "asc" }, { macroArea: "asc" }],
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore salvataggio preferenze";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
