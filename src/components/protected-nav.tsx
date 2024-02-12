import ProtectedNavItem from "@/components/protected-nav-item";

export const navLinks = [
  { label: "Dashboard", href: "/dashboard", name: "dashboard" },
  {
    label: "Bank Accounts",
    href: "/dashboard/bank-accounts",
    name: "bank-accounts",
  },
  { label: "Debit Cards", href: "/dashboard/debit-cards", name: "debit-cards" },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    name: "transactions",
  },
  {
    label: "Payouts",
    href: "/dashboard/payouts",
    name: "payouts",
  },
  {
    label: "Tax",
    href: "/dashboard/tax",
    name: "tax",
  },
];

export default function ProtectedNav() {
  return (
    <div className="flex-1 overflow-auto py-2">
      <nav className="flex flex-col items-start px-4 text-sm font-medium">
        {navLinks.map((item) => (
          <ProtectedNavItem key={item.label} {...item} />
        ))}
      </nav>
    </div>
  );
}
