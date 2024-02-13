import { CardContent } from "@/components/ui/card";
import { TaxSettings } from "@/types";
import TaxAddress from "@/components/tax-address";

export default function TaxSettingsDetails({
  head_office,
  defaults: { tax_behavior, tax_code },
  status,
}: TaxSettings) {
  if (status === "pending") return null;

  return (
    <>
      {head_office && (
        <CardContent>
          <h4 className="font-semibold">HeadOffice</h4>
          <TaxAddress headOffice={head_office} />
        </CardContent>
      )}
      {tax_behavior && (
        <CardContent>
          <h4 className="font-semibold">Tax Behaviour</h4>
          <p>{tax_behavior}</p>
        </CardContent>
      )}
      {tax_code && (
        <CardContent>
          <h4 className="font-semibold">Tax Code</h4>
          <p>{tax_code}</p>
        </CardContent>
      )}
    </>
  );
}
