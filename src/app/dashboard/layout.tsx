"use client";
import { PropsWithChildren, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { platform_name } from "@/constants";
import Image from "next/image";
import ProtectedNav from "@/components/protected-nav";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  const { isAuthed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed) router.push("/login");
  }, [isAuthed, router]);

  return (
    <div className="grid h-full max-h-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="border-r h-full hidden lg:block">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <span className="">{platform_name}</span>
          </Link>
        </div>
        <ProtectedNav />
      </div>
      <div className="flex flex-col h-full max-h-full overflow-hidden">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b px-6 justify-between lg:justify-end">
          <Link className="lg:hidden font-semibold" href="#">
            <span className="sr-only">Home</span>
            <span>{platform_name}</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border border-gray-200 w-8 h-8"
                size="icon"
                variant="ghost"
              >
                <Image
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src="/placeholder.svg"
                  width="32"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="dashboard" className="cursor-pointer lg:hidden">
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>
              <Link
                href="/dashboard/bank-accounts"
                className="cursor-pointer lg:hidden"
              >
                <DropdownMenuItem>Bank Accounts</DropdownMenuItem>
              </Link>
              <Link
                href="/dashboard/debit-cards"
                className="cursor-pointer lg:hidden"
              >
                <DropdownMenuItem>Debit Cards</DropdownMenuItem>
              </Link>
              <Link href="logout" className="cursor-pointer">
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </div>
    </div>
  );
}
