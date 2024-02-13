"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import useTaxSettings from "@/hooks/use-tax-settings";
import { cn } from "@/lib/utils";
import TaxSettingsForm from "@/components/tax-settings-form";
import TaxRegistrationForm from "@/components/tax-registration-form";
import useTaxRegistration from "@/hooks/use-tax-registration";
import TaxSettingsDetails from "@/components/tax-settings-details";
import TaxRegistrations from "@/components/tax-registrations";

export default function Tax() {
  const { taxSettings } = useTaxSettings();
  const { taxRegistrations } = useTaxRegistration();

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
        <Card>
          <CardHeader>
            <CardTitle>Add New Tax Registration</CardTitle>
            <p>Add your tax registration for a select state</p>
          </CardHeader>
          <CardContent>
            <TaxRegistrationForm />
          </CardContent>
        </Card>
      </div>
      {taxSettings && (
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
        </div>
      )}
      <TaxRegistrations taxRegistrations={taxRegistrations} />
    </main>
  );
}
