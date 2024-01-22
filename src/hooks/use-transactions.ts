import useAuthFetch from "@/hooks/use-auth-fetch";
import useSWR from "swr";
import { Transaction, TransactionsListParams } from "@/types";
import { convertToQueryString } from "@/utils";

export default function useTransactions(params: TransactionsListParams) {
  const authFetch = useAuthFetch();
  const paramsString = convertToQueryString(params as any);
  const fetcher = (url: string) => authFetch<{ data: Transaction[] }>(url);
  const { data } = useSWR(
    "/api/stripe/connected/charges/list?" + paramsString,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return data?.data;
}
