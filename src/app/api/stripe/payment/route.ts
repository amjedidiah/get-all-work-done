import { stripeSecret as stripe } from "@/lib/stripe";
import { IPData } from "@/types";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, transfer_group } = await request.json();

    // Fetch customer's IP address for Tax calculation
    const ipData: IPData = await fetch("https://ipapi.co/json/").then((res) =>
      res.json()
    );
    if (!ipData.ip) throw { message: "IP address not found", statusCode: 404 };

    // Calculate tax
    const calculation = await stripe.tax.calculations.create({
      currency: "usd",
      line_items: [
        {
          amount,
          reference: "L1",
        },
      ],
      customer_details: {
        ip_address: ipData.ip,
      },
    });

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
