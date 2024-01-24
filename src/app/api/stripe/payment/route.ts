import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, transfer_group } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      transfer_group,
      metadata: {
        gigId: transfer_group,
      },
    });

    return NextResponse.json({
      data: {
        payment_intent: paymentIntent,
      },
      message: "Payment intent created successfully",
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
