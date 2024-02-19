"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useTaxSettings from "@/hooks/use-tax-settings";
import TaxSettingsDetails from "@/components/tax-settings-details";

export default function TaxSettings() {
  const { taxSettings } = useTaxSettings();
  if (!taxSettings) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Tax Status</CardTitle>
          <span
            className={cn("py-1 px-4 rounded font-medium text-white", {
              "bg-green-500": taxSettings.status === "active",
              "bg-slate-500 ": taxSettings.status === "pending",
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
                The following details need to be provided to activate your tax
                settings:
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
    </div>
  );
}
