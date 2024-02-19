import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import TaxSettingsForm from "@/components/tax-settings-form";
import TaxRegistrationForm from "@/components/tax-registration-form";
import TaxRegistrations from "@/components/tax-registrations";
import TaxReports from "@/components/tax-reports";
import TaxSettings from "@/components/tax-settings";
import TaxReportForm from "@/components/tax-report-form";

export default function Tax() {
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
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Tax Report</CardTitle>
          </CardHeader>
          <CardContent>
            <TaxReportForm />
          </CardContent>
        </Card>
      </div>
      <TaxSettings />
      <TaxRegistrations />
      <TaxReports />
    </main>
  );
}
