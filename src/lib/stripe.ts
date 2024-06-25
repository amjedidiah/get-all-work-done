import { loadStripe } from "@stripe/stripe-js";

export const stripePublishable = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);
