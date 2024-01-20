"use client";
import { Button } from "@/components/ui/button";
import useDebitCardForm from "@/hooks/use-debit-card-form";
import { CardElement } from "@stripe/react-stripe-js";

export default function DebitCardForm() {
  const { formSubmit, formResponse } = useDebitCardForm();

  return (
    <form className="space-y-4" onSubmit={formSubmit}>
      <p className="text-sm text-yellow-500">
        Debit card must be a{" "}
        <span className="font-semibold">
          non-prepaid Visa, Mastercard, or Discover
        </span>{" "}
        card issued by a bank <span className="font-semibold">in the US</span>{" "}
        limited to <span className="font-semibold">9,999 USD/payout</span>
      </p>
      <CardElement />
      <Button className="w-full">Save</Button>

      <p>{formResponse}</p>
    </form>
  );
}
