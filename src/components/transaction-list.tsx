"use client";
import useConnectInstance from "@/hooks/use-connect-instance";
import {
  ConnectComponentsProvider,
  ConnectPayments,
} from "@stripe/react-connect-js";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionList() {
  const stripeConnectInstance = useConnectInstance();

  if (!stripeConnectInstance) return <div>Loading...</div>;

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <CardHeader>
        <CardTitle>Stripe Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <ConnectPayments />
      </CardContent>
    </ConnectComponentsProvider>
  );
}
