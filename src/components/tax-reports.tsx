"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useTaxReport from "@/hooks/use-tax-report";
import { Button } from "@/components/ui/button";

export default function TaxReports() {
  const { taxReports, fetchFileLink } = useTaxReport();
  if (!taxReports) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tax Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxReports.map(
                ({
                  id,
                  created,
                  parameters: { interval_start: from, interval_end: to },
                  result,
                  status,
                }) => (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>
                      {new Date(created * 1000).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(from * 1000).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(to * 1000).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{result?.title}</TableCell>
                    <TableCell>{result?.size}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "py-1 px-4 rounded font-medium  text-white",
                          {
                            "bg-green-500": status === "succeeded",
                            "bg-slate-500 ": status === "pending",
                          }
                        )}
                      >
                        {status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {result?.id && (
                        <Button onClick={() => fetchFileLink(id)}>
                          Download
                        </Button>
                      )}
                    </TableCell>
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
