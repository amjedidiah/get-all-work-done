import { useState, useCallback, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { City } from "country-state-city";
import useAuthFetch from "@/hooks/use-auth-fetch";
import { useSWRConfig } from "swr";

interface TaxSettingsFormValues {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
}

const initialValues: TaxSettingsFormValues = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
};

export default function useTaxSettingsForm() {
  const { mutate } = useSWRConfig();
  const authFetch = useAuthFetch();
  const [formValues, setFormValues] =
    useState<TaxSettingsFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState<string>("");
  const cities = useMemo(() => {
    if (!formValues.state) return [];

    return City.getCitiesOfState("US", formValues.state).map(
      ({ name }) => name
    );
  }, [formValues.state]);

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
      if (!formValues.postal_code) throw new Error("Postal code is required");

      // 2. Update tax settings
      await authFetch<any>("/connect/tax.settings/update", {
        method: "POST",
        body: JSON.stringify({
          defaults: {
            tax_behavior: "inferred_by_currency",
            tax_code: "txcd_10000000",
          },
          ["head_office"]: { address: { ...formValues, country: "US" } },
        }),
      }).then(() => mutate("/connect/tax.settings/retrieve"));

      setFormResponse("Tax settings updated");
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

  const handleCityChange = useCallback(
    (city: string) => setFormValues((prev) => ({ ...prev, city })),
    []
  );

  return {
    formSubmit,
    handleFormChange,
    formValues,
    formResponse,
    cities,

    handleStateChange,
    handleCityChange,
  };
}
