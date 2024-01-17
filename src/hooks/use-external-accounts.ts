import useAuthFetch from "./use-auth-fetch";
import useAuth from "@/hooks/use-auth";
import useSWR, { useSWRConfig } from "swr";
import { ExternalAccount, ExternalAccountObject } from "@/types";
import { useCallback, useMemo } from "react";

const modifyExternalAccountsData = (externalAccounts?: ExternalAccount[]) => {
  if (!externalAccounts?.length) return [];

  return externalAccounts.map((externalAccount) => {
    const initialExternalAccount = {
      id: externalAccount.id,
      last4: externalAccount.last4,
      status: externalAccount.status,
      available_payout_methods: externalAccount.available_payout_methods,
      default_for_currency: externalAccount.default_for_currency,
    };

    if ("routing_number" in externalAccount)
      return {
        ...initialExternalAccount,
        bank_name: externalAccount.bank_name,
        routing_number: externalAccount.routing_number,
      };

    return {
      ...initialExternalAccount,
      brand: externalAccount.brand,
      exp_month: externalAccount.exp_month,
      exp_year: externalAccount.exp_year,
    };
  });
};

export default function useExternalAccounts(type: ExternalAccountObject) {
  const key = `/api/stripe/external-account?type=${type}`;
  const { isAuthed } = useAuth();
  const authFetch = useAuthFetch();
  const fetcher = (url: string) =>
    authFetch<{ externalAccountsType: ExternalAccount[] }>(url);
  const { data } = useSWR(!isAuthed ? null : key, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
  const externalAccounts = data?.externalAccountsType;
  const modifiedExternalAccounts = useMemo(
    () => modifyExternalAccountsData(externalAccounts),
    [externalAccounts]
  );
  const { mutate } = useSWRConfig();

  const handleCreateExternalAccount = useCallback(
    async (external_account_token: string) =>
      authFetch(
        "/api/stripe/external-account",
        {
          method: "POST",
          body: JSON.stringify({}),
        },
        {
          headers: [
            { name: "External-Account-Token", value: external_account_token },
          ],
        }
      ).then(async (data) => {
        await mutate(key);
        return data;
      }),
    [authFetch, key, mutate]
  );

  const getAlreadyExists = useCallback(
    (externalAccountNumber: string) => {
      if (!externalAccounts?.length) return false;

      const last4s = externalAccounts
        .filter(({ object }) => object === type)
        .map(({ last4 }) => last4);
      const currentLast4 = externalAccountNumber.slice(-4);

      return last4s.includes(currentLast4);
    },
    [externalAccounts, type]
  );

  const handleDeleteExternalAccount = useCallback(
    async (externalAccountId?: string) => {
      await authFetch(`/api/stripe/external-account/${externalAccountId}`, {
        method: "DELETE",
      });
      mutate(key);
    },
    [authFetch, key, mutate]
  );

  const handleMakeDefaultExternalAccount = useCallback(
    async (externalAccountId?: string) => {
      await authFetch(`/api/stripe/external-account/${externalAccountId}`, {
        method: "PATCH",
      });
      mutate(key);
    },
    [authFetch, key, mutate]
  );

  return {
    externalAccounts: modifiedExternalAccounts,
    handleCreateExternalAccount,
    getAlreadyExists,
    handleDeleteExternalAccount,
    handleMakeDefaultExternalAccount,
  };
}
