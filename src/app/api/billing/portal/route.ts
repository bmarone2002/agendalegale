import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/db/user";
import { getStripeServerClient } from "@/lib/billing/stripe";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateDbUser();
    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { success: false, error: "Nessun cliente Stripe associato all'utente." },
        { status: 400 }
      );
    }

    const stripe = getStripeServerClient();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin ?? "http://localhost:3000";
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/`,
    });

    return NextResponse.json({ success: true, data: { portalUrl: session.url } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore apertura portale abbonamento";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
