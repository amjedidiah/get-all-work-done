"use client";
import PayForm from "@/components/pay-form";
import usePay from "@/hooks/use-pay";
import { stripePublishable } from "@/lib/stripe.fe";
import { Elements } from "@stripe/react-stripe-js";

export default function Pay() {
  const { clientSecret, paymentIntentId, gig } = usePay();

  if (!clientSecret) return null;

  return (
    <Elements stripe={stripePublishable} options={{ clientSecret }}>
      <div className="container mx-auto grid gap-4">
        <PayForm price={gig?.price} paymentIntentId={paymentIntentId} />
      </div>
    </Elements>
  );
}
