import { BankAccountFormValues } from "@/types";
import useToken from "@/hooks/use-token";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import useExternalAccounts from "@/hooks/use-external-accounts";

const initialValues: BankAccountFormValues = {
  account_number: "",
  routing_number: "",
};

const validateRoutingNumber = (routingNumber: string) => {
  if (routingNumber.length !== 9) throw new Error("Invalid routing number");
};

export default function useBankAccountForm() {
  const { generateExternalAccountToken } = useToken();
  const [formValues, setFormValues] =
    useState<BankAccountFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState("");
  const { handleCreateExternalAccount, getAlreadyExists } =
    useExternalAccounts("bank_account");

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
      const { account_number, routing_number } = formValues;

      // 2. Validations
      if (!account_number) throw new Error("Account number is required");
      validateRoutingNumber(routing_number);

      // 3. Check if already exists
      const alreadyExists = await getAlreadyExists(formValues.account_number);
      if (alreadyExists) throw new Error("Bank account already exists");

      // 3. Generate token
      const token = await generateExternalAccountToken(
        formValues,
        "bank_account"
      );

      console.info("Token generated: ", token);

      // 4. Create bank account
      const data = handleCreateExternalAccount(token!);
      console.info("Bank account created: ", data);

      setFormResponse("Bank account created");
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
