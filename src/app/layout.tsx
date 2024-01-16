import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { platform_name } from "@/constants";
import { PropsWithChildren } from "react";
import Header from "@/components/header";

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
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
