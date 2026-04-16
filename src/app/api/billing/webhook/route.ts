import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { derivePlanFromPriceId, mapStripeStatus } from "@/lib/billing/subscription";
import { getStripeServerClient } from "@/lib/billing/stripe";

export const runtime = "nodejs";

function toDateOrNull(unixSeconds: number | null | undefined): Date | null {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000);
}

async function findUserForSubscription(
  subscription: {
    customer: string | { id?: string } | null;
    metadata?: Record<string, string>;
  }
): Promise<{ id: string } | null> {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;

  if (customerId) {
    const byCustomer = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });
    if (byCustomer) return byCustomer;
  }

  const metadataUserId = subscription.metadata?.userId;
  if (!metadataUserId) return null;

  return prisma.user.findUnique({
    where: { id: metadataUserId },
    select: { id: true },
  });
}

async function syncSubscription(subscription: any) {
  const user = await findUserForSubscription(subscription);
  if (!user) {
    console.warn("Webhook Stripe: utente non trovato per subscription", subscription.id);
    return;
  }

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id ?? null;
  const mappedStatus = mapStripeStatus(subscription.status);
  const nextPlan = derivePlanFromPriceId(priceId);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeCustomerId: customerId ?? undefined,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      subscriptionStatus: mappedStatus,
      currentPlan: mappedStatus === "canceled" ? "free" : nextPlan,
      trialEndsAt: toDateOrNull(subscription.trial_end),
    },
  });
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ success: false, error: "STRIPE_WEBHOOK_SECRET mancante" }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ success: false, error: "Header stripe-signature mancante" }, { status: 400 });
  }

  try {
    const payload = await req.text();
    const stripe = getStripeServerClient();
    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as {
          mode?: string;
          subscription?: string | { id?: string } | null;
        };
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
          await syncSubscription(subscription);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await syncSubscription(subscription);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as { subscription?: string | { id?: string } | null };
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        if (subscriptionId) {
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { subscriptionStatus: "past_due" },
          });
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore webhook Stripe";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
