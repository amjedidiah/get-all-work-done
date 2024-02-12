"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import useTaxSettings from "@/hooks/use-tax-settings";
import { TaxSettings } from "@/types";
import { cn } from "@/lib/utils";
import TaxSettingsForm from "@/components/tax-settings-form";

export default function Tax() {
  const { taxSettings } = useTaxSettings();

  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto grid gap-6">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Settings</CardTitle>
            <p>Update head office in tax settings</p>
          </CardHeader>
          <CardContent>
            <TaxSettingsForm />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        {taxSettings && (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Tax Settings</CardTitle>
              <span
                className={cn("py-1 px-4 rounded font-medium", {
                  "bg-green-500 text-white": (taxSettings.status = "active"),
                  "bg-slate-500 ": (taxSettings.status = "pending"),
                })}
              >
                {taxSettings.status}
              </span>
            </CardHeader>
            <TaxSettingsDetails {...taxSettings} />
            {taxSettings.status_details.pending &&
              taxSettings.status_details.pending.missing_fields && (
                <CardContent className="grid gap-2">
                  <p>
                    The following details need to be provided to activate your
                    tax settings:
                  </p>
                  <ul>
                    {taxSettings.status_details.pending.missing_fields.map(
                      (item) => (
                        <li key={item}>
                          <span className="py-1 px-2 text-sm rounded font-medium bg-red-500 text-white">
                            {item}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              )}
          </Card>
        )}
      </div>
    </main>
  );
}

const TaxSettingsDetails = ({
  head_office,
  defaults: { tax_behavior, tax_code },
  status,
}: TaxSettings) => {
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
};

const TaxAddress = ({
  headOffice,
}: {
  headOffice: TaxSettings["head_office"];
}) => {
  if (!headOffice) return null;
  const { line1, line2, city, state, country, postal_code } =
    headOffice.address;

  return (
    <address>
      {line1} {line2} {city} {state} {country} {postal_code}
    </address>
  );
};
