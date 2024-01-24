"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useWithdrawForm from "@/hooks/use-withdraw-form";

export type WithdrawFormProps = {
  withdrawableBalance: number;
  canWithdraw: boolean;
};

export default function WithdrawForm({
  withdrawableBalance,
  canWithdraw,
}: WithdrawFormProps) {
  const { formSubmit, handleFormChange, formValues, formResponse } =
    useWithdrawForm({ withdrawableBalance });

  if (!canWithdraw) return null;
  return (
    <form className="space-y-4 max-w-lg" onSubmit={formSubmit}>
      <div className="space-y-2 flex justify-end items-center gap-4">
        <Input
          id="amount"
          name="amount"
          placeholder="Amount"
          type="number"
          onChange={handleFormChange}
          value={formValues.amount}
          className="mt-2"
        />
        <Button>Withdraw</Button>
      </div>

      <p>{formResponse}</p>
    </form>
  );
}
