import { PayFormProps } from "@/components/pay-form";
import { swrFetcher } from "@/utils";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";

export default function usePayForm({ price, paymentIntentId }: PayFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const { data } = useSWR(
    discountedPrice
      ? {
          url: "/payment",
          body: JSON.stringify({
            amount: discountedPrice,
            paymentIntentId,
          }),
          method: "PATCH",
        }
      : null,
    swrFetcher
  );
  const [discountApplied, setDiscountApplied] = useState(false);

  const applyDiscount: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const appliedDiscount = Number(e.currentTarget.dataset.discount);

    setDiscountedPrice(((100 - appliedDiscount) / 100) * Number(price));
  };

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
    const discountApplied = async () => {
      if (!elements) return;

      console.info("fetching updates...");
      await elements.fetchUpdates();

      console.info("Updates fetched...");
      setDiscountApplied(true);
    };

    if (data?.data?.status === "requires_payment_method") discountApplied();
  }, [data?.data?.status, elements]);

  return {
    handleSubmit,
    discountApplied,
    errorMessage,
    applyDiscount,
    stripe,
    price: price ?? 0,
    discountedPrice,
  };
}
