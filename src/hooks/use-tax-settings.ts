import useSWR from "swr";
import useAuthFetch from "@/hooks/use-auth-fetch";
import { TaxSettings } from "@/types";

export default function useTaxSettings() {
  const authFetch = useAuthFetch();
  const fetcher = (url: string) => authFetch<TaxSettings>(url);
  const { data } = useSWR("/connect/tax.settings/retrieve", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return { taxSettings: data };
}
