import TransactionList from "@/components/transaction-list";
import TransactionListCustom from "@/components/transaction-list-custom";

export default function Transactions() {
  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto grid gap-6">
      <div className="flex flex-col gap-6">
        <TransactionList />
      </div>

      <div className="flex flex-col gap-6">
        <TransactionListCustom />
      </div>
    </main>
  );
}
