import { useRouter, useSearchParams } from "next/navigation";
import useGig from "@/hooks/use-gig";
import { useCallback, useEffect, useState } from "react";
import { Gig } from "@/types";

const handlePayment = async (gig: Gig) => {
  if (!gig) throw new Error("Gig not found");

  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: gig.price,
      transfer_group: gig.id,
    }),
  }).then((res) => res.json());
};

export default function usePay() {
  const searchParams = useSearchParams();
  const gigId = searchParams.get("gig");
  const router = useRouter();
  const gig = useGig(gigId);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [shouldGoHome, setShouldGoHome] = useState(false);
  const [shouldHandleGig, setShouldHandleGig] = useState(false);

  const handleGig = useCallback(async () => {
    try {
      const { data } = await handlePayment(gig as Gig);
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
    if (shouldGoHome) router.push("/");
  }, [router, shouldGoHome]);

  useEffect(() => {
    if (shouldHandleGig) handleGig();
  }, [handleGig, shouldHandleGig]);

  useEffect(() => {
    if (!gig?.id) {
      setShouldGoHome(true);
      return;
    }

    setShouldHandleGig(true);
  }, [gig?.id]);

  return {
    clientSecret,
    paymentIntentId,
    gig,
  };
}
