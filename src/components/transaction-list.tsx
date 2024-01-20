import useConnectInstance from "@/hooks/use-connect-instance";
import {
  ConnectComponentsProvider,
  ConnectPayments,
} from "@stripe/react-connect-js";
import { CardContent, CardHeader, CardTitle } from "./ui/card";

export default function TransactionList() {
  const stripeConnectInstance = useConnectInstance();

  if (!stripeConnectInstance) return <div>Loading...</div>;

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <CardHeader>
        <CardTitle>Stripe Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <ConnectPayments key={"transactions"} />
      </CardContent>
    </ConnectComponentsProvider>
  );
}
