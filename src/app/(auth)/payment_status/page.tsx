"use client";
import { Elements } from "@stripe/react-stripe-js";
import { stripePublishable } from "@/lib/stripe.fe";
import PaymentStatus from "@/components/payment-status";

const PayStatus = () => {
  return (
    <Elements stripe={stripePublishable}>
      <PaymentStatus />
    </Elements>
  );
};

export default PayStatus;
