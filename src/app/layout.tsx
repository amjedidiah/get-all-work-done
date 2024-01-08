import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "@/app/globals.css";
import { platform_name } from "@/constants";
import { PropsWithChildren } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: platform_name,
  description: "Let's help you get teh work done",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} min-h-full grid grid-rows-[auto,1fr]`}
      >
        <header className="shadow-lg py-4">
          <nav className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
            <a href="/" className="font-bold text-xl">
              {platform_name}
            </a>

            <ul className="flex items-center gap-2">
              <li className="py-2 px-3">
                <Link href="register">Register</Link>
              </li>
              <li className="py-2 px-3">
                <Link href="login">Login</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
