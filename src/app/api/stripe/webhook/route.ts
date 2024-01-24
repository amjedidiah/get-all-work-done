import { stripeSecret as stripe } from "@/lib/stripe";
import { StripeEvent } from "@/types";
import { handleRequestError } from "@/utils";
import { NextResponse, type NextRequest } from "next/server";
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature") as string;
  let event: StripeEvent;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    // Check if the webhook is in live mode to handle effectively
    // const isLiveMode = event.livemode;

    // Handle the event
    switch (event.type) {
      default:
        console.info(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json(null, {
      status: 200,
    });
  } catch (error: any) {
    return handleRequestError(error);
  }
}
