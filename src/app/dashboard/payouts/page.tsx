import PayoutListCustom from "@/components/payout-list-custom";
import PayoutList from "@/components/payout-list";
import BalanceCard from "@/components/balance-card";

export default function Payouts() {
  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto grid gap-6">
      <div className="flex flex-col gap-6">
        <PayoutList />
      </div>

      <div className="flex flex-col gap-6">
        <BalanceCard />
      </div>

      <div className="flex flex-col gap-6">
        <PayoutListCustom />
      </div>
    </main>
  );
}
