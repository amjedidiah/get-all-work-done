import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { platform_name } from "@/constants";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: platform_name,
  description: "Let's help you get teh work done",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
