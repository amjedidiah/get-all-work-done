import useAuthFetch from "@/hooks/use-auth-fetch";
import useSWR from "swr";
import { Transaction, TransactionsParams } from "@/types";
import { convertToQueryString } from "@/utils";

export default function useTransactions(params: TransactionsParams) {
  const authFetch = useAuthFetch();
  const paramsString = convertToQueryString(params as any);
  const fetcher = (url: string) =>
    authFetch<{ transactions: Transaction[] }>(url);
  const { data } = useSWR("/api/stripe/transactions?" + paramsString, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return data?.transactions;
}
