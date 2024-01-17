import useAuthFetch from "./use-auth-fetch";
import useAuth from "./use-auth";
import useSWR, { useSWRConfig } from "swr";
import { BankAccount } from "@/types";
import { useCallback, useMemo } from "react";

const modifyBankAccountsData = (bankAccounts?: BankAccount[]) => {
  if (!bankAccounts?.length) return [];

  return bankAccounts.map((bankAccount) => ({
    id: bankAccount.id,
    bank_name: bankAccount.bank_name,
    last4: bankAccount.last4,
    routing_number: bankAccount.routing_number,
    status: bankAccount.status,
    available_payout_methods: bankAccount.available_payout_methods,
    default_for_currency: bankAccount.default_for_currency,
  }));
};

export default function useBankAccounts() {
  const { isAuthed } = useAuth();
  const authFetch = useAuthFetch();
  const fetcher = (url: string) =>
    authFetch<{ bankAccounts: BankAccount[] }>(url);
  const { data } = useSWR(
    !isAuthed ? null : "/api/stripe/bank-account",
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  const bankAccounts = data?.bankAccounts;
  const modifiedBankAccounts = useMemo(
    () => modifyBankAccountsData(bankAccounts),
    [bankAccounts]
  );
  const { mutate } = useSWRConfig();

  const handleCreateBankAccount = useCallback(
    async (bank_token: string) =>
      authFetch(
        "/api/stripe/bank-account",
        {
          method: "POST",
          body: JSON.stringify({}),
        },
        {
          headers: [{ name: "Bank-Account-Token", value: bank_token }],
        }
      ).then(async (data) => {
        await mutate("/api/stripe/bank-account");
        return data;
      }),
    [authFetch, mutate]
  );

  const getAlreadyExists = useCallback(
    (accountNumber: string) => {
      if (!bankAccounts?.length) return false;

      const last4s = bankAccounts.map(({ last4 }) => last4);
      const currentLast4 = accountNumber.slice(-4);

      return last4s.includes(currentLast4);
    },
    [bankAccounts]
  );

  const handleDeleteBankAccount = useCallback(
    async (bankAccountId?: string) => {
      await authFetch(`/api/stripe/bank-account/${bankAccountId}`, {
        method: "DELETE",
      });
      mutate("/api/stripe/bank-account");
    },
    [authFetch, mutate]
  );

  const handleMakeDefaultBankAccount = useCallback(
    async (bankAccountId?: string) => {
      await authFetch(`/api/stripe/bank-account/${bankAccountId}`, {
        method: "PATCH",
      });
      mutate("/api/stripe/bank-account");
    },
    [authFetch, mutate]
  );

  return {
    bankAccounts: modifiedBankAccounts,
    handleCreateBankAccount,
    getAlreadyExists,
    handleDeleteBankAccount,
    handleMakeDefaultBankAccount,
  };
}
