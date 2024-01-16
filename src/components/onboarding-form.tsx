"use client";
import useAuthFetch from "@/hooks/use-auth-fetch";
import useGetUser from "@/hooks/use-get-user";
import { StripeConnectInstance } from "@stripe/connect-js";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { useEffect, useState } from "react";

export default function OnboardingForm() {
  const authFetch = useAuthFetch();
  const user = useGetUser();
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance>();

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

  if (!stripeConnectInstance) return <div>Loading...</div>;

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectAccountOnboarding
        onExit={() => console.info("The account has exited onboarding")}
      />
    </ConnectComponentsProvider>
  );
}
