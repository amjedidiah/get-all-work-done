"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useBankAccountForm from "@/hooks/use-bank-account-form";

export default function BankAccountForm() {
  const { formSubmit, handleFormChange, formValues, formResponse } =
    useBankAccountForm();
  return (
    <form className="space-y-4" onSubmit={formSubmit}>
      <p className="text-sm text-yellow-500">
        Account must be a{" "}
        <span className="font-semibold">checking account</span> in the{" "}
        <span className="font-semibold">US</span>
      </p>
      <div className="space-y-2">
        <Label htmlFor="account-number">Account Number</Label>
        <Input
          id="account-number"
          name="account_number"
          placeholder="Enter your account number"
          onChange={handleFormChange}
          value={formValues.account_number}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="routing-number">Routing Number</Label>
        <Input
          id="routing-number"
          name="routing_number"
          placeholder="Enter your routing number"
          onChange={handleFormChange}
          value={formValues.routing_number}
        />
      </div>
      <Button className="w-full">Save</Button>

      <p>{formResponse}</p>
    </form>
  );
}
