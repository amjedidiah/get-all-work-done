"use client";
import useConnectInstance from "@/hooks/use-connect-instance";
import {
  ConnectComponentsProvider,
  ConnectPayouts,
} from "@stripe/react-connect-js";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PayoutList() {
  const stripeConnectInstance = useConnectInstance();

  if (!stripeConnectInstance) return <div>Loading...</div>;

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <CardHeader>
        <CardTitle>Stripe Payouts History</CardTitle>
      </CardHeader>
      <CardContent>
        <ConnectPayouts />
      </CardContent>
    </ConnectComponentsProvider>
  );
}
