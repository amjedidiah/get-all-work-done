import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import useTaxReport from "@/hooks/use-tax-report";

interface TaxReportFormValues {
  start: string;
  end: string;
}

const initialValues: TaxReportFormValues = {
  start: "",
  end: "",
};

export default function useTaxReportForm() {
  const [formValues, setFormValues] =
    useState<TaxReportFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState<string>("");
  const { handleCreateTaxReport } = useTaxReport();

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
      if (!formValues.start) throw new Error("Start date is required");
      if (!formValues.end) throw new Error("End date is required");

      // 2. Format values
      const interval_start = Math.floor(
        new Date(formValues.start).getTime() / 1000
      );
      const interval_end = Math.floor(
        new Date(formValues.end).getTime() / 1000
      );

      // 3. Request tax report
      await handleCreateTaxReport({ interval_start, interval_end });

      setFormResponse("Tax report requested");
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
