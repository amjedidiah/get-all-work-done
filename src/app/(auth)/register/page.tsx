"use client";
import RegisterForm from "@/components/register-form";
import Article from "@/components/shared/article";
import Section from "@/components/shared/section";
import useAuth from "@/hooks/use-auth";
import { stripePublishable } from "@/lib/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Register() {
  const router = useRouter();
  const { isAuthed } = useAuth();

  useEffect(() => {
    if (isAuthed) router.push("/onboarding");
  }, [isAuthed, router]);

  return (
    <Section>
      <Article>
        <Elements stripe={stripePublishable}>
          <RegisterForm />
        </Elements>
      </Article>
    </Section>
  );
}
