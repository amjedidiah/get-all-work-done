"use client";
import Article from "@/components/shared/article";
import Section from "@/components/shared/section";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const { isAuthed, expireUserToken } = useAuth();

  useEffect(() => {
    if (isAuthed) expireUserToken();

    router.push("/");
  }, [expireUserToken, isAuthed, router]);

  return (
    <Section>
      <Article>
        <p>Logging you out...</p>
      </Article>
    </Section>
  );
}
