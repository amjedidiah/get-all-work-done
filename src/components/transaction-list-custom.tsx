"use client";
import useTransactions from "@/hooks/use-transactions";
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

export default function TransactionListCustom() {
  const transactions = useTransactions({ limit: 10 });

  if (!transactions) return null;

  return (
    <section>
      <article>
        <Card>
          <CardHeader>
            <CardTitle>Custom Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(
                  ({
                    created,
                    id,
                    amount,
                    status,
                    refunded,
                    amount_refunded,
                    receipt_url,
                    customer,
                  }) => {
                    const timeObject = new Date(created * 1000);
                    const date = timeObject.toDateString();
                    const time = timeObject.toLocaleTimeString();

                    return (
                      <TableRow key={id}>
                        <TableCell>{formatAmount(amount)}</TableCell>
                        <TableCell>
                          <span className="bg-slate-400 text-white rounded-lg w-fit py-1 px-2">
                            {refunded
                              ? `refunded ${formatAmount(amount_refunded)}`
                              : status}
                          </span>
                        </TableCell>
                        <TableCell>{id}</TableCell>
                        <TableCell>
                          {date} <span>{time}</span>
                        </TableCell>
                        <TableCell>
                          {receipt_url && (
                            <a
                              href={receipt_url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              Get receipt
                            </a>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </article>
    </section>
  );
}
