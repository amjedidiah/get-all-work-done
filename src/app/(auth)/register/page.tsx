"use client";
import RegisterForm from "@/components/register-form";
import { stripePublishable } from "@/lib/stripe";
import { Elements } from "@stripe/react-stripe-js";

export default function Register() {
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
