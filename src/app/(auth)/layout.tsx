"use client";
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
    <>
      <section className="py-8">
        <article className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl">{title}</h1>
        </article>
      </section>

      {children}
    </>
  );
}
