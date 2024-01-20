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
import { Elements } from "@stripe/react-stripe-js";
import { stripePublishable } from "@/lib/stripe";
import useExternalAccounts from "@/hooks/use-external-accounts";
import DebitCardForm from "@/components/debit-card-form";

export default function DebitCards() {
  const {
    externalAccounts,
    handleDeleteExternalAccount,
    handleMakeDefaultExternalAccount,
  } = useExternalAccounts("card");

  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto grid gap-6">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New Debit Card</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePublishable}>
              <DebitCardForm />
            </Elements>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Existing Debit Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Last 4</TableHead>
                  <TableHead>
                    Expiration
                    <span className="hidden">expiration month and year</span>
                  </TableHead>
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
                    if ("brand" in rest)
                      return (
                        <TableRow key={id}>
                          <TableCell>{rest.brand}</TableCell>
                          <TableCell>{last4}</TableCell>
                          <TableCell>
                            {rest.exp_month} / {rest.exp_year}
                          </TableCell>
                          <TableCell>{status}</TableCell>
                          <TableCell className="flex flex-col lg:flex-row flex-wrap gap-2">
                            {available_payout_methods?.map((item) => (
                              <span
                                className="py-1 px-4 bg-slate-200 rounded font-medium"
                                key={`${last4}-item`}
                              >
                                {item}
                              </span>
                            ))}
                            {default_for_currency && (
                              <span
                                className="py-1 px-4 bg-green-500 text-white rounded font-medium"
                                key={`${last4}-item`}
                              >
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
