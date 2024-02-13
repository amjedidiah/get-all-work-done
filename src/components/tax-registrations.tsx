"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { TaxRegistration } from "@/types";
import { cn } from "@/lib/utils";
import useTaxRegistration from "@/hooks/use-tax-registration";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TaxRegistrations({
  taxRegistrations,
}: {
  taxRegistrations?: TaxRegistration[];
}) {
  const { expireTaxRegistration } = useTaxRegistration();
  if (!taxRegistrations) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tax Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Active From</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxRegistrations.map(
                ({
                  id,
                  country_options: {
                    us: { state },
                  },
                  created,
                  active_from,
                  expires_at,
                  status,
                }) => (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{state}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>{active_from}</TableCell>
                    <TableCell>{expires_at}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "py-1 px-4 rounded font-medium  text-white",
                          {
                            "bg-green-500": status === "active",
                            "bg-slate-500 ": status === "expired",
                          }
                        )}
                      >
                        {status}
                      </span>
                    </TableCell>
                    {status === "active" && (
                      <TableCell>
                        <button
                          className="py-2 px-3 bg-red-500 hover:bg-red-600 rounded text-white mb-2 lg:me-2"
                          id={id}
                          onClick={expireTaxRegistration}
                        >
                          End
                        </button>
                      </TableCell>
                    )}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
