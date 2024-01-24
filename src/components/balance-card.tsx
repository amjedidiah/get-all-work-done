"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useBalance from "@/hooks/use-balance";
import useUser from "@/hooks/use-user";
import { formatAmount } from "@/utils";
import WithdrawForm from "@/components/withdraw-form";

export default function BalanceCard() {
  const { pendingBalance, availableBalance } = useBalance();
  const { user } = useUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Balance</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <WithdrawForm
          canWithdraw={!!(user?.account?.payouts_enabled && availableBalance)}
          withdrawableBalance={availableBalance / 100}
        />
        <div className="grid grid-cols-3 gap-6">
          <div className="grid items-center">
            <div>Available Balance</div>
            <div className="text-4xl font-bold">
              {formatAmount(availableBalance)}
            </div>
          </div>
          <div className="grid items-center">
            <div>Pending Balance</div>
            <div className="text-4xl font-bold">
              {formatAmount(pendingBalance)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
