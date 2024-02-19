"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/constants";
import useTaxRegistrationForm from "@/hooks/use-tax-registration-form";

export default function TaxRegistrationForm() {
  const {
    formSubmit,
    handleFormChange,
    formValues,
    formResponse,
    handleStateChange,
  } = useTaxRegistrationForm();

  return (
    <form className="space-y-4" onSubmit={formSubmit}>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select onValueChange={handleStateChange} value={formValues.state}>
          <div>
            <SelectTrigger>
              <SelectValue placeholder="Select the state where you have your tax registration" />
            </SelectTrigger>
          </div>
          <SelectContent>
            {states.map(({ name, isoCode }) => (
              <SelectItem key={isoCode} value={isoCode}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiresDate">Expires At</Label>
        <Input
          id="expiresDate"
          name="expiresDate"
          type="date"
          onChange={handleFormChange}
          value={formValues.expiresDate}
        />
      </div>
      <Button className="w-full">Save</Button>

      <p>{formResponse}</p>
    </form>
  );
}
