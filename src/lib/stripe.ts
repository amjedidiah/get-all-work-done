import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

export const stripePublishable = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export const stripeSecret = new Stripe(process.env.STRIPE_SECRET_KEY as string);
