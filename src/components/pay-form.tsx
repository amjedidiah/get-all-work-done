"use client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEventHandler, useEffect, useState } from "react";

export default function PayForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams.get("amount");
  const application = searchParams.get("application");
  const destination = searchParams.get("destination");
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> | undefined = async (
    event
  ) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://localhost:3000/payment_status",
      },
      // redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message!);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

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
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}
