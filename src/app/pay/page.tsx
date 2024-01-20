"use client";
import PayForm from "@/components/pay-form";
import { stripePublishable } from "@/lib/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams.get("amount");
  const application = searchParams.get("application");
  const destination = searchParams.get("destination");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const handleHire = async () => {
      try {
        const application_fee_amount =
          (Number(application) / 100) * Number(amount);

        const res = await fetch("/api/stripe/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            application_fee_amount,
            destination: `acct_${destination}`,
          }),
        }).then((res) => res.json());
        const cS = res?.data?.client_secret;

        if (cS) setClientSecret(cS);
      } catch (error) {
        console.error(error);
      }
    };
    if (!amount && !destination) return router.push("/");

    handleHire();
  }, [amount, application, destination, router]);

  if (!clientSecret) return null;

  return (
    <Elements stripe={stripePublishable} options={{ clientSecret }}>
      <PayForm />
    </Elements>
  );
}
