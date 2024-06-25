import { WithdrawFormValues } from "@/types";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import useAuthFetch from "@/hooks/use-auth-fetch";
import { WithdrawFormProps } from "@/components/withdraw-form";
import { useSWRConfig } from "swr";

const initialValues: WithdrawFormValues = {
  amount: 0,
};

export default function useWithdrawForm({
  withdrawableBalance,
}: Pick<WithdrawFormProps, "withdrawableBalance">) {
  const [formValues, setFormValues] =
    useState<WithdrawFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState("");
  const authFetch = useAuthFetch();
  const { mutate } = useSWRConfig();

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
      const data = await authFetch<any>("/connect/payouts/create", {
        method: "POST",
        body: JSON.stringify({
          amount: amount * 100, // accounting for cents
          currency: "usd",
        }),
      });
      console.info("Withdrawal successful: ", data);
      mutate("/connect/payouts/list?limit=100"); // Update payouts list
      mutate("/connect/balance/retrieve"); // Update available balance

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