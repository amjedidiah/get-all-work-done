import { Balance } from "@/types";
import useAuth from "@/hooks/use-auth";
import useAuthFetch from "@/hooks/use-auth-fetch";
import useSWR from "swr";

export default function useBalance() {
  const key = `/api/stripe/connected/balance/retrieve`;
  const { isAuthed } = useAuth();
  const authFetch = useAuthFetch();
  const fetcher = (url: string) => authFetch<Balance>(url);
  const { data } = useSWR(!isAuthed ? null : key, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const compileBalance = (
    balanceObject:
      | Balance["available"]
      | Balance["pending"]
      | Balance["instant_available"]
  ) => balanceObject?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;

  console.info(data);

  return {
    pendingBalance: compileBalance(data?.pending),
    availableBalance: compileBalance(data?.available),
    instantAvailableBalance: compileBalance(data?.instant_available),
  };
}
