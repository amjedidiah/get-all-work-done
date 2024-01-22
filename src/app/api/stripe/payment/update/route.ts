import { stripeSecret as stripe } from "@/lib/stripe";
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

    const paymentIntent = await stripe.paymentIntents.update(
      payment_intent_id,
      {
        amount: Number(amount),
      }
    );

    return NextResponse.json({
      data: {
        status: paymentIntent.status,
      },
      message: "Payment intent created successfully",
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
