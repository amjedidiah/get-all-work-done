import { handleGigTransfer, stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { gigId } = await request.json();
    if (!gigId)
      throw {
        status: 400,
        message: "Invalid request params",
      };

    // Get gig paymentIntent
    const paymentIntentSearch = await stripe.paymentIntents.search({
      query: `metadata["gigId"]:"${gigId}" AND status:"succeeded"`,
    });
    if (!paymentIntentSearch.data.length)
      throw {
        status: 404,
        message: "No payment intent found for this gig",
      };

    const paymentIntent = paymentIntentSearch.data[0];
    await handleGigTransfer(gigId, paymentIntent);

    return NextResponse.json({
      message: "Transfers completed successfully",
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
