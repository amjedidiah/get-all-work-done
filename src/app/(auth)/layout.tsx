"use client";
import Header from "@/components/header";
import Main from "@/components/main";
import Article from "@/components/shared/article";
import Section from "@/components/shared/section";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const title = useMemo(
    () =>
      ({
        "/register": "Register an account",
        "/login": "Login to your account",
        "/onboarding": "Onboarding",
      }[pathname] || ""),
    [pathname]
  );

  return (
    <Main>
      <Header />
      <main>
        <Section>
          <Article>
            <h1 className="text-4xl">{title}</h1>
          </Article>
        </Section>

        {children}
      </main>
    </Main>
  );
}
