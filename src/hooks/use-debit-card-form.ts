import { DebitCardFormValues } from "@/types";
import useToken from "@/hooks/use-token";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import useExternalAccounts from "@/hooks/use-external-accounts";

const initialValues: DebitCardFormValues = {
  default_for_currency: false,

  name: "",

  number: "",
  expiry: "",
  cvc: "",
};

const validateExpiry = (expMonth: number, expYear: number) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  if (expYear < currentYear) throw new Error("Invalid expiry year");
  if (expYear === currentYear && expMonth <= currentMonth)
    throw new Error("Invalid expiry month");
};

const extractExpiry = (expiry: string) => {
  const [exp_year, exp_month] = expiry.split("-").map(Number);
  validateExpiry(exp_month, exp_year);
  return { exp_month, exp_year };
};

export default function useDebitCardForm() {
  const { generateExternalAccountToken } = useToken();
  const [formValues, setFormValues] =
    useState<DebitCardFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState("");
  const { handleCreateExternalAccount, getAlreadyExists } =
    useExternalAccounts("card");

  const handleFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.currentTarget;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    },
    [formValues]
  );

  const handleFormSubmit = useDebouncedCallback(async () => {
    try {
      // 1. Format values
      const { expiry, ...rest } = formValues;
      const formattedExpiry = extractExpiry(expiry);

      // 2. Validations
      if (!rest.number) throw new Error("Account number is required");
      if (!rest.cvc) throw new Error("Card CVC is required");

      // 3. Check if already exists
      const alreadyExists = await getAlreadyExists(rest.number);
      if (alreadyExists) throw new Error("Debit card already exists");

      // 3. Generate token
      const token = await generateExternalAccountToken(
        { ...rest, ...formattedExpiry },
        "card"
      );
      console.info("Token generated: ", token);

      // 4. Create bank account
      const data = handleCreateExternalAccount(token!);
      console.info("Debit card created: ", data);

      setFormResponse("Debit card created");
      setFormValues(initialValues);
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
    handleFormChange,
    formValues,
    formResponse,
  };
}
