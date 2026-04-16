import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/db/user";
import { hasPremiumAccess, isTrialExpired } from "@/lib/billing/subscription";

export async function GET() {
  try {
    const user = await getOrCreateDbUser();
    const trialExpired = isTrialExpired(user.trialEndsAt);

    return NextResponse.json({
      success: true,
      data: {
        currentPlan: user.currentPlan,
        subscriptionStatus: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        trialEndsAt: user.trialEndsAt,
        trialExpired,
        isTester: user.isTester,
        planOverride: user.planOverride,
        hasPremiumAccess: hasPremiumAccess(user),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore caricamento stato abbonamento";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
