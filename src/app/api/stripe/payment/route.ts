import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, application_fee_amount, destination } =
      await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      application_fee_amount,
      transfer_data: {
        destination,
      },
    });

    return NextResponse.json({
      data: {
        client_secret: paymentIntent.client_secret,
      },
      message: "Payment intent created successfully",
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
