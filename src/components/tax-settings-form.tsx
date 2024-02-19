"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useTaxSettingsForm from "@/hooks/use-tax-settings-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/constants";

export default function TaxSettingsForm() {
  const {
    formSubmit,
    handleFormChange,
    formValues,
    formResponse,
    cities,
    handleStateChange,
    handleCityChange,
  } = useTaxSettingsForm();

  return (
    <form className="space-y-4" onSubmit={formSubmit}>
      <div className="space-y-2">
        <Label htmlFor="line1">Address Line 1</Label>
        <Input
          id="line1"
          name="line1"
          placeholder="Enter your address line 1"
          onChange={handleFormChange}
          value={formValues.line1}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="line2">Address Line 2</Label>
        <Input
          id="line2"
          name="line2"
          placeholder="Enter your address line 2"
          onChange={handleFormChange}
          value={formValues.line2}
        />
      </div>
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
      {formValues.state && cities && (
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select onValueChange={handleCityChange} value={formValues.city}>
            <div>
              <SelectTrigger>
                <SelectValue placeholder="Select the city where you have your tax registration" />
              </SelectTrigger>
            </div>
            <SelectContent>
              {cities.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="postal-code">Postal Code</Label>
        <Input
          id="postal-code"
          name="postal_code"
          placeholder="Enter your postal code"
          onChange={handleFormChange}
          value={formValues.postal_code}
        />
      </div>
      <Button className="w-full">Save</Button>

      <p>{formResponse}</p>
    </form>
  );
}
