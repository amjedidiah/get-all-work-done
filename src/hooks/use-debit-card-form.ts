import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import useExternalAccounts from "@/hooks/use-external-accounts";
import { useElements, useStripe } from "@stripe/react-stripe-js";

export default function useDebitCardForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [formResponse, setFormResponse] = useState("");
  const { handleCreateExternalAccount } = useExternalAccounts("card");

  const handleFormSubmit = useDebouncedCallback(async () => {
    if (!stripe || !elements) return;
    try {
      // 1. Get card element
      const cardElement = elements.getElement("card");
      if (!cardElement) throw new Error("Card element not found");

      // 3. Generate token
      const { token } = await stripe.createToken(cardElement, {
        currency: "usd",
      });
      if (!token) throw new Error("Token not generated");
      console.info("Token generated: ", token);

      // 4. Create debit card
      const data = await handleCreateExternalAccount(token.id);
      console.info("Debit card created: ", data);

      setFormResponse("Debit card created");
    } catch (error: any) {
      setFormResponse(error?.message ?? "Something went wrong");
    } finally {
      setTimeout(() => {
        setFormResponse("");
      }, 5000);
    }
  }, 1500);

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleFormSubmit();
  };

  return {
    formSubmit,
    formResponse,
  };
}
