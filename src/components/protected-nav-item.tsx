"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { navLinks } from "@/components/protected-nav";

type Props = (typeof navLinks)[0];

export default function ProtectedNavItem({ href, label, name }: Props) {
  const pathname = usePathname();
  const isActive = useMemo(() => pathname === href, [href, pathname]);

  const Icon = useCallback(
    (props: { className: string }) => {
      if (name === "payouts")
        return (
          <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
        );

      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12V7H5a2 2 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 2h16v-5" />
          <path d="M18 12a2 2 0 4h4v-4Z" />
        </svg>
      );
    },
    [name]
  );

  return (
    <Link
      href={href}
      key={label}
      className={cn(
        "flex items-center gap-3 rounded-lg  px-3 py-2 text-gray-900  transition-all capitalize",
        {
          "bg-gray-900 text-gray-100": isActive,
        }
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
