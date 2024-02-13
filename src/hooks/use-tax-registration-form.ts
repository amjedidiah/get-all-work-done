import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import useTaxRegistration from "@/hooks/use-tax-registration";

interface TaxRegistrationFormValues {
  state: string;
  expiresDate: string;
}

const initialValues: TaxRegistrationFormValues = {
  state: "",
  expiresDate: "",
};

export default function useTaxRegistrationForm() {
  const [formValues, setFormValues] =
    useState<TaxRegistrationFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState<string>("");
  const { createTaxRegistration } = useTaxRegistration();

  const handleFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    },
    [formValues]
  );

  const handleFormSubmit = useDebouncedCallback(async () => {
    try {
      // 1. Validations
      if (!formValues.state) throw new Error("State is required");

      // 2. Update tax settings
      await createTaxRegistration(formValues.state, formValues.expiresDate);

      setFormResponse("Tax registration created");
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

  const handleStateChange = useCallback(
    (state: string) => setFormValues((prev) => ({ ...prev, state })),
    []
  );

  return {
    formSubmit,
    handleFormChange,
    formValues,
    formResponse,
    handleStateChange,
  };
}
