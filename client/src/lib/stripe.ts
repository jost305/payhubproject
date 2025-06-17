import { loadStripe } from "@stripe/stripe-js";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createPaymentIntent = async (projectId: number, clientEmail: string) => {
  const response = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId, clientEmail }),
  });

  if (!response.ok) {
    throw new Error("Failed to create payment intent");
  }

  return response.json();
};
