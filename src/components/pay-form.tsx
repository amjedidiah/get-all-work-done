"use client";
import { PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import usePayForm from "@/hooks/use-pay-form";
import { formatAmount } from "@/utils";

export type PayFormProps = {
  price?: number;
  paymentIntentId: string;
};

const discount = 10;

export default function PayForm(props: PayFormProps) {
  const {
    handleSubmit,
    applyDiscount,
    errorMessage,
    stripe,
    price,
    discountApplied,
    discountedPrice,
  } = usePayForm(props);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <PaymentElement />
      <Button disabled={!stripe}>
        Pay {formatAmount(discountApplied ? discountedPrice : price)}
      </Button>
      {!discountApplied && (
        <Button
          variant="outline"
          data-discount={discount}
          onClick={applyDiscount}
          type="button"
        >
          Apply {discount}% discount
        </Button>
      )}
      {discountApplied ? <span>discount applied</span> : null}
      {errorMessage ? <div>{errorMessage}</div> : null}
    </form>
  );
}
