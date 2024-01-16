"use client";
import LoginForm from "@/components/login-form";
import Article from "@/components/shared/article";
import Section from "@/components/shared/section";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { isAuthed } = useAuth();

  useEffect(() => {
    if (isAuthed) router.push("/onboarding");
  }, [isAuthed, router]);

  return (
    <Section>
      <Article>
        <LoginForm />
      </Article>
    </Section>
  );
}
