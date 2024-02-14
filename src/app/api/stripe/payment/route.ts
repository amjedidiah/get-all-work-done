import { calculateTax, stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, transfer_group } = await request.json();

    // Calculate tax
    const calculation = await calculateTax(amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculation.amount_total,
      currency: "usd",
      transfer_group,
      metadata: {
        gigId: transfer_group,
        tax_calculation: calculation.id,
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
