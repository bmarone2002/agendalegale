-- Create enum for subscription lifecycle
CREATE TYPE "SubscriptionStatus" AS ENUM ('free', 'trialing', 'active', 'past_due', 'canceled');

-- Extend User with billing/tester fields
ALTER TABLE "User"
ADD COLUMN "stripeCustomerId" TEXT,
ADD COLUMN "stripeSubscriptionId" TEXT,
ADD COLUMN "stripePriceId" TEXT,
ADD COLUMN "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'free',
ADD COLUMN "currentPlan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN "trialEndsAt" TIMESTAMP(3),
ADD COLUMN "isTester" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "planOverride" TEXT;

-- Uniqueness for Stripe references
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");

-- Query performance on gating checks
CREATE INDEX "User_subscriptionStatus_idx" ON "User"("subscriptionStatus");
CREATE INDEX "User_isTester_idx" ON "User"("isTester");
