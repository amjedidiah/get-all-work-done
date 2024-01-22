"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { formatAmount } from "@/utils";
import usePayouts from "@/hooks/use-payouts";

export default function PayoutListCustom() {
  const payouts = usePayouts({ limit: 10 });

  if (!payouts) return null;

  return (
    <section>
      <article>
        <Card>
          <CardHeader>
            <CardTitle>Custom Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map(({ created, id, amount, status, destination }) => {
                  const timeObject = new Date(created * 1000);
                  const date = timeObject.toDateString();
                  const time = timeObject.toLocaleTimeString();

                  return (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{formatAmount(amount)}</TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell>{destination?.toString()}</TableCell>
                      <TableCell>
                        {date} <span>{time}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </article>
    </section>
  );
}
