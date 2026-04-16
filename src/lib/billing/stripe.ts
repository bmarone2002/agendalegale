let stripeClient: any = null;

export function getStripeServerClient() {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Variabile STRIPE_SECRET_KEY non configurata");
  }

  let StripeCtor: any;
  try {
    const stripePackage = require("stripe");
    StripeCtor = stripePackage.default ?? stripePackage;
  } catch {
    throw new Error(
      "Pacchetto 'stripe' non installato. Esegui 'npm install stripe' per abilitare il billing."
    );
  }

  stripeClient = new StripeCtor(secretKey, {
    typescript: true,
  });

  return stripeClient;
}
