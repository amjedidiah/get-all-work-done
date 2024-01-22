import useAuthFetch from "@/hooks/use-auth-fetch";
import {
  StripeConnectInstance,
  loadConnectAndInitialize,
} from "@stripe/connect-js";
import { useEffect, useState } from "react";
import useUser from "@/hooks/use-user";

export default function useConnectInstance() {
  const authFetch = useAuthFetch();
  const { user } = useUser();
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance>();

  useEffect(() => {
    // Fetch the AccountSession client secret
    const fetchClientSecret = async () => {
      if (!user?.accountId) return "";

      const data = await authFetch<{
        client_secret: string;
      }>("/api/stripe/account/session", {
        method: "POST",
        body: JSON.stringify({
          account_id: user.accountId,
        }),
      });

      return "client_secret" in data ? data.client_secret : "";
    };

    if (user?.accountId && !stripeConnectInstance)
      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret,
          appearance: {},
          fonts: [],
        })
      );
  }, [user?.accountId, stripeConnectInstance, authFetch]);

  return stripeConnectInstance;
}
