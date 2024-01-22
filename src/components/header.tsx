"use client";
import { platform_name } from "@/constants";
import useAuth from "@/hooks/use-auth";
import Link from "next/link";
import { useEffect, useState } from "react";

const initHeaderLinks = [
  {
    label: "register",
    href: "register",
  },
  {
    label: "login",
    href: "login",
  },
];

export default function Header() {
  const [headerLinks, setHeaderLinks] = useState(initHeaderLinks);
  const { isAuthed } = useAuth();

  useEffect(() => {
    if (isAuthed)
      setHeaderLinks([
        {
          label: "dashboard",
          href: "dashboard",
        },
        {
          label: "logout",
          href: "logout",
        },
      ]);
  }, [isAuthed]);

  return (
    <header className="shadow-lg py-4">
      <nav className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        <a href="/" className="font-bold text-xl">
          {platform_name}
        </a>

        <ul className="flex items-center gap-2">
          {headerLinks.map(({ label, href }) => (
            <li className="py-2 px-3" key={label}>
              <Link className="capitalize" href={href} suppressHydrationWarning>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
