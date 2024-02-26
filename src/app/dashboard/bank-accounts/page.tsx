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
import BankAccountForm from "@/components/bank-account-form";
import { Elements } from "@stripe/react-stripe-js";
import { stripePublishable } from "@/lib/stripe.fe";
import useExternalAccounts from "@/hooks/use-external-accounts";

export default function BankAccounts() {
  const {
    externalAccounts,
    handleDeleteExternalAccount,
    handleMakeDefaultExternalAccount,
  } = useExternalAccounts("bank_account");

  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto grid gap-6">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New Bank Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePublishable}>
              <BankAccountForm />
            </Elements>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Existing Bank Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Last 4</TableHead>
                  <TableHead>Routing Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payout Methods</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {externalAccounts.map(
                  ({
                    id,
                    last4,
                    status,
                    available_payout_methods,
                    default_for_currency,
                    ...rest
                  }) => {
                    if ("routing_number" in rest)
                      return (
                        <TableRow key={id}>
                          <TableCell>{rest.bank_name}</TableCell>
                          <TableCell>{last4}</TableCell>
                          <TableCell>{rest.routing_number}</TableCell>
                          <TableCell>{status}</TableCell>
                          <TableCell className="flex flex-col lg:flex-row flex-wrap gap-2">
                            {available_payout_methods?.map((item, i) => (
                              <span
                                className="py-1 px-4 bg-slate-200 rounded font-medium"
                                key={`${last4}-item-${i}`}
                              >
                                {item}
                              </span>
                            ))}
                            {default_for_currency && (
                              <span className="py-1 px-4 bg-green-500 text-white rounded font-medium">
                                default
                              </span>
                            )}
                          </TableCell>
                          {!default_for_currency && (
                            <TableCell>
                              <button
                                className="py-2 px-3 bg-red-500 hover:bg-red-600 rounded text-white mb-2 lg:me-2"
                                data-id={id}
                                onClick={(e) =>
                                  handleDeleteExternalAccount(
                                    e.currentTarget.dataset.id
                                  )
                                }
                              >
                                Delete
                              </button>

                              <button
                                className="py-2 px-3 border border-slate-200 bg-slate-200 hover:bg-slate-300 rounded"
                                data-id={id}
                                onClick={(e) =>
                                  handleMakeDefaultExternalAccount(
                                    e.currentTarget.dataset.id
                                  )
                                }
                              >
                                Make Default
                              </button>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                  }
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
