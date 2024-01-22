import { PayFormProps } from "@/components/pay-form";
import { swrFetcher } from "@/utils";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEventHandler, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export default function usePayForm({ price, paymentIntentId }: PayFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const discountedPrice = useMemo(
    () => (price ?? 0) - discount,
    [discount, price]
  );
  const shouldUpdatePaymentIntent = useMemo(() => !!discount, [discount]);
  const { data } = useSWR(
    shouldUpdatePaymentIntent
      ? `/api/stripe/payment/update?amount=${discountedPrice}&paymentIntentId=${paymentIntentId}`
      : null,
    swrFetcher
  );

  const applyDiscount = () => setDiscount(50);

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
    if (data.data?.status === "requires_payment_method" && elements) {
      console.info("fetching updates...");
      elements.fetchUpdates();
    }
  }, [data.data?.status, elements]);

  return {
    handleSubmit,
    discount,
    errorMessage,
    applyDiscount,
    stripe,
    price,
  };
}
