"use client";
import { PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import usePayForm from "@/hooks/use-pay-form";

export type PayFormProps = {
  price?: number;
  paymentIntentId: string;
};

export default function PayForm(props: PayFormProps) {
  const { handleSubmit, applyDiscount, errorMessage, discount, stripe, price } =
    usePayForm(props);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <PaymentElement />
      <Button disabled={!stripe}>Submit</Button>
      {price && !discount && (
        <Button variant="outline" onClick={applyDiscount} type="button">
          Apply discount
        </Button>
      )}
      {discount ? <span>discount applied</span> : null}
      {errorMessage ? <div>{errorMessage}</div> : null}
    </form>
  );
}
