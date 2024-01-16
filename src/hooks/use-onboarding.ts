import useAuthFetch from "@/hooks/use-auth-fetch";
import {
  StripeConnectInstance,
  loadConnectAndInitialize,
} from "@stripe/connect-js";
import { useEffect, useState } from "react";
import useUser from "@/hooks/use-user";

export default function useOnboarding() {
  const authFetch = useAuthFetch();
  const { user, handleUpdateUser } = useUser();
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance>();

  const updateIsOnboarded = () =>
    handleUpdateUser({
      dbUpdate: {
        isOnboarded: true,
      },
    });

  useEffect(() => {
    // Fetch the AccountSession client secret
    const fetchClientSecret = async () => {
      const data = await authFetch<{
        client_secret: string;
      }>("/api/stripe/account/session", {
        method: "POST",
        body: JSON.stringify({
          account_id: user?.accountId,
        }),
      });

      return "client_secret" in data ? data.client_secret : "";
    };

    if (user?.accountId && !stripeConnectInstance)
      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret,
        })
      );
  }, [user?.accountId, stripeConnectInstance, authFetch]);

  return {
    updateIsOnboarded,
    stripeConnectInstance,
  };
}
