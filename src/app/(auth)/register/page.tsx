"use client";
import RegisterForm from "@/components/register-form";
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
    <section>
      <article className="container mx-auto px-4 lg:px-8">
        <Elements stripe={stripePublishable}>
          <RegisterForm />
        </Elements>
      </article>
    </section>
  );
}
