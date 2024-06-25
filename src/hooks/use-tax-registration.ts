import useAuthFetch from "@/hooks/use-auth-fetch";
import { TaxRegistration } from "@/types";
import { MouseEventHandler, useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";

export default function useTaxRegistration() {
  const authFetch = useAuthFetch();
  const fetcher = (url: string) => authFetch<{ data: TaxRegistration[] }>(url);
  const { data } = useSWR("/connect/tax.registrations/list", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
  const { mutate } = useSWRConfig();

  const createTaxRegistration = useCallback(
    async (state: string, expiresDate?: string) => {
      const expires_at = expiresDate
        ? new Date(expiresDate).getTime() / 1000
        : undefined;

      return authFetch<any>("/connect/tax.registrations/create", {
        method: "POST",
        body: JSON.stringify({
          country: "US",
          country_options: {
            us: {
              state,
              type: "state_sales_tax",
            },
          },
          active_from: "now",
          expires_at,
        }),
      }).then(() => {
        mutate("/connect/tax.registrations/list");
        mutate("/connect/tax.settings/retrieve");
      });
    },
    [authFetch, mutate]
  );

  const expireTaxRegistration: MouseEventHandler<HTMLButtonElement> =
    useCallback(
      async (e) => {
        const taxRegistrationId = e.currentTarget.id;

        return authFetch<any>(
          `/connect/tax.registrations/update?id=${taxRegistrationId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              expires_at: "now",
            }),
          }
        ).then(() => {
          mutate("/connect/tax.registrations/list");
          mutate("/connect/tax.settings/retrieve");
        });
      },
      [authFetch, mutate]
    );

  return {
    createTaxRegistration,
    expireTaxRegistration,
    taxRegistrations: data?.data,
  };
}
