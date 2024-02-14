import { handleRefundTransfers, stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { refund_reason, payment_intent_id } = await request.json();
    // Refund reason must be one of: duplicate, fraudulent, requested_by_customer

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
    });
    console.info("Charge refunded successfully: ", refund);

    // Reverse the tax transaction
    const taxTransactionReversal = await stripe.tax.transactions.createReversal(
      {
        mode: "full",
        original_transaction: paymentIntent.metadata.tax_transaction,
        reference: `${paymentIntent.id}-full-refund`,
        metadata: {
          refund_reason,
        },
        expand: ["line_items"],
      }
    );
    console.info(
      "Tax transaction reversed successfully: ",
      taxTransactionReversal
    );

    const transfer_reversals = await handleRefundTransfers(
      paymentIntent.transfer_group,
      refund_reason
    );

    return NextResponse.json({
      data: {
        refund: "refund",
        tax_transaction_reversal: "taxTransactionReversal",
        transfer_reversals,
      },
      message: "All refunds done successfully",
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
