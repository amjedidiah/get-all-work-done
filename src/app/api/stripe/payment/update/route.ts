import { calculateTax, stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const amount = params.get("amount");
    const payment_intent_id = params.get("paymentIntentId");

    if (!amount || !payment_intent_id)
      throw {
        statusCode: 400,
        message: "Invalid request",
      };

    // Recalculate tax
    const calculation = await calculateTax(Number(amount));

    // Update payment intent
    const paymentIntent = await stripe.paymentIntents.update(
      payment_intent_id,
      {
        amount: calculation.amount_total,
        metadata: {
          tax_calculation: calculation.id,
        },
      }
    );

    return NextResponse.json({
      data: {
        status: paymentIntent.status,
      },
      message: "Payment intent updated successfully",
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
