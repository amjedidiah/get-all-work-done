import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature") as string;
  let event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    // Handle the event
    switch (event.type) {
      default:
        console.info(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json(null);
  } catch (error: any) {
    return handleRequestError(error, false);
  }
}
