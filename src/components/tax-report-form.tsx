"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTaxReportForm from "@/hooks/use-tax-report-form";

export default function TaxReportForm() {
  const { formSubmit, handleFormChange, formValues, formResponse } =
    useTaxReportForm();

  return (
    <form className="space-y-4" onSubmit={formSubmit}>
      <div className="space-y-2">
        <Label htmlFor="start">From</Label>
        <Input
          id="start"
          name="start"
          type="date"
          onChange={handleFormChange}
          value={formValues.start}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end">To</Label>
        <Input
          id="end"
          name="end"
          type="date"
          onChange={handleFormChange}
          value={formValues.end}
        />
      </div>
      <Button className="w-full">Request</Button>

      <p>{formResponse}</p>
    </form>
  );
}
