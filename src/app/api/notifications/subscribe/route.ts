import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/db/user";

const subscribeSchema = z.object({
  provider: z.string().min(1).default("onesignal"),
  externalDeviceId: z.string().min(1, "externalDeviceId obbligatorio"),
  pushToken: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  locale: z.string().nullable().optional(),
  notificationsOn: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getOrCreateDbUser();
    const payload = subscribeSchema.parse(await req.json());

    const device = await prisma.notificationDevice.upsert({
      where: {
        provider_externalDeviceId: {
          provider: payload.provider,
          externalDeviceId: payload.externalDeviceId,
        },
      },
      create: {
        userId: user.id,
        provider: payload.provider,
        externalDeviceId: payload.externalDeviceId,
        pushToken: payload.pushToken ?? null,
        platform: payload.platform ?? null,
        locale: payload.locale ?? null,
        notificationsOn: payload.notificationsOn ?? true,
        lastSeenAt: new Date(),
      },
      update: {
        userId: user.id,
        pushToken: payload.pushToken ?? null,
        platform: payload.platform ?? null,
        locale: payload.locale ?? null,
        notificationsOn: payload.notificationsOn ?? true,
        lastSeenAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: device });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore registrazione device";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
