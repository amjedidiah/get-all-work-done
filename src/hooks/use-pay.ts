import { useRouter, useSearchParams } from "next/navigation";
import useGig from "@/hooks/use-gig";
import { useCallback, useEffect, useState } from "react";

export default function usePay() {
  const searchParams = useSearchParams();
  const gigId = searchParams.get("gig");
  const router = useRouter();
  const gig = useGig(gigId);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  const handleGig = useCallback(async () => {
    if (!gig) return;

    try {
      const { data } = await fetch("/api/stripe/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: gig.price,
          transfer_group: gig.id,
        }),
      }).then((res) => res.json());
      const paymentIntent = data?.payment_intent;

      if (paymentIntent) {
        setClientSecret(paymentIntent.client_secret);
        setPaymentIntentId(paymentIntent.id);
      }
    } catch (error) {
      console.error(error);
    }
  }, [gig]);

  useEffect(() => {
    if (!gig?.id) return router.push("/");

    handleGig();
  }, [gig?.id, handleGig, router]);

  return {
    clientSecret,
    paymentIntentId,
    gig,
  };
}
