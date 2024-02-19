import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { refund_reason, payment_intent_id, amount } = await request.json();
    // Refund reason must be one of: duplicate, fraudulent, requested_by_customer
    // amount is in dollars

    // Get the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (!paymentIntent.latest_charge)
      throw {
        statusCode: 400,
        message: "Cannot reverse this payment because no charge was found",
      };

    // Refund the charge
    const refund = await stripe.refunds.create({
      charge: paymentIntent.latest_charge.toString(),
      reason: refund_reason,
      amount: amount * 100,
    });
    console.info("Charge refunded successfully: ", refund);

    // Reverse the tax transaction
    const taxTransactionReversal = await stripe.tax.transactions.createReversal(
      {
        mode: "full",
        original_transaction: paymentIntent.metadata.tax_transaction,
        reference: `${paymentIntent.id}-full-refund`,
        metadata: {
          refund: refund.id,
          refund_reason,
        },
        expand: ["line_items"],
      }
    );
    console.info(
      "Tax transaction reversed successfully: ",
      taxTransactionReversal
    );

    return NextResponse.json({
      data: {
        refund,
        tax_transaction_reversal: taxTransactionReversal,
      },
      message:
        "Charge and tax transaction reversed successfully. Don't forget to refund associated transfers.",
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
