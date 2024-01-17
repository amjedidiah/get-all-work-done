"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useDebitCardForm from "@/hooks/use-debit-card-form";

export default function DebitCardForm() {
  const { formSubmit, handleFormChange, formValues, formResponse } =
    useDebitCardForm();
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
      <div className="space-y-2">
        <Label htmlFor="routing-number">Name on card</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter the name on your card"
          onChange={handleFormChange}
          value={formValues.name}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number">Card Number</Label>
        <Input
          id="number"
          name="number"
          placeholder="Enter your card number"
          onChange={handleFormChange}
          value={formValues.number}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiry">Card Expiry</Label>
        <Input
          id="expiry"
          name="expiry"
          placeholder="Enter your card expiry"
          onChange={handleFormChange}
          value={formValues.expiry}
          type="month"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cvc">Card CVC</Label>
        <Input
          id="cvc"
          name="cvc"
          placeholder="Enter your card CVC"
          onChange={handleFormChange}
          value={formValues.cvc}
          type="text"
        />
      </div>
      <Button className="w-full">Save</Button>

      <p>{formResponse}</p>
    </form>
  );
}
