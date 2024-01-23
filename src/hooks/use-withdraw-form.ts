import { WithdrawFormValues } from "@/types";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import useAuthFetch from "./use-auth-fetch";
import { WithdrawFormProps } from "@/components/withdraw-form";

const initialValues: WithdrawFormValues = {
  amount: 0,
};

export default function useWithdrawForm({
  withdrawableBalance,
}: WithdrawFormProps) {
  const [formValues, setFormValues] =
    useState<WithdrawFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState("");
  const authFetch = useAuthFetch();

  const handleFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.currentTarget;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    },
    [formValues]
  );

  const handleFormSubmit = useDebouncedCallback(async () => {
    try {
      // 1. Format values
      const amount = Number(formValues.amount);

      // 2. Validations
      if (!amount) throw new Error("Amount is required to withdraw");
      if (amount > withdrawableBalance) throw new Error("Insufficient funds");

      // 3. Withdraw
      const data = await authFetch<any>(
        "/api/stripe/connected/payouts/create",
        {
          method: "POST",
          body: JSON.stringify({
            amount,
            currency: "usd",
          }),
        }
      );
      console.info("Withdrawal successful: ", data);

      setFormResponse("Withdrawal successful");
      setFormValues(initialValues);
    } catch (error: any) {
      setFormResponse(error?.message ?? "Something went wrong");
    } finally {
      setTimeout(() => {
        setFormResponse("");
      }, 5000);
    }
  }, 1500);

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleFormSubmit();
  };

  return {
    formSubmit,
    handleFormChange,
    formValues,
    formResponse,
  };
}
