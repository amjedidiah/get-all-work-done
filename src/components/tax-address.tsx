import { TaxSettings } from "@/types";

export default function TaxAddress({
  headOffice,
}: {
  headOffice: TaxSettings["head_office"];
}) {
  if (!headOffice) return null;
  const { line1, line2, city, state, country, postal_code } =
    headOffice.address;

  return (
    <address>
      {line1} {line2} {city} {state} {country} {postal_code}
    </address>
  );
}
