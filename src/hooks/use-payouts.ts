import useAuthFetch from "@/hooks/use-auth-fetch";
import useSWR from "swr";
import { Payout, PayoutListParams } from "@/types";
import { convertToQueryString } from "@/utils";

export default function usePayouts(params: PayoutListParams) {
  const authFetch = useAuthFetch();
  const paramsString = convertToQueryString(params as any);
  const fetcher = (url: string) => authFetch<{ data: Payout[] }>(url);
  const { data } = useSWR(
    "/api/stripe/connected/payouts/list?" + paramsString,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return data?.data;
}
