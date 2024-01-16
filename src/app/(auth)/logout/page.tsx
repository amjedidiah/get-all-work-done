"use client";
import Article from "@/components/shared/article";
import Section from "@/components/shared/section";
import useLogout from "@/hooks/use-logout";

export default function Logout() {
  useLogout();

  return (
    <Section>
      <Article>
        <p>Logging you out...</p>
      </Article>
    </Section>
  );
}
