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
                  <TableHead>Platform Commission</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(
                  ({
                    created,
                    id,
                    amount,
                    currency,
                    status,
                    application_fee_amount,
                  }) => {
                    const timeObject = new Date(created * 1000);
                    const date = timeObject.toDateString();
                    const time = timeObject.toLocaleTimeString();
                    const net_amount = amount - Number(application_fee_amount);

                    return (
                      <TableRow key={id}>
                        <TableCell>{formatAmount(amount)}</TableCell>
                        <TableCell>
                          {formatAmount(application_fee_amount || 0)}
                        </TableCell>
                        <TableCell>{formatAmount(net_amount)}</TableCell>
                        <TableCell>
                          <span className="bg-slate-400 text-white rounded-lg w-fit py-1 px-2">
                            {status}
                          </span>
                        </TableCell>
                        <TableCell>{id}</TableCell>
                        <TableCell>
                          {date} <span>{time}</span>
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
