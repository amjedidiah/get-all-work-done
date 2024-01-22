import { gigs } from "@/constants";
import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        // Get payment intent
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Get necessary info from payment intent
        const gigId = paymentIntent.transfer_group;
        const latestCharge = paymentIntent.latest_charge as string;
        if (!latestCharge || !gigId) break;

        // Get the particular gig for this payment intent
        const gig = gigs.find((gig) => gig.id === gigId);
        if (!gig) break;
        console.info("gig: ", gig);

        // Get contractor account IDs for this gig
        const contractors = gig.contractors;
        const contractorAccountIDs = contractors.map(({ id }) => id);
        if (!contractorAccountIDs.length) break;
        console.info("contractorAccountIDs: ", contractorAccountIDs);

        // Calculate amount to be shared
        const balance = (1 - gig.platformFeePercentage) * paymentIntent.amount;
        const share = Math.floor(balance / contractors.length);

        // Make the necessary transfers
        for (const destination of contractorAccountIDs) {
          //Transfer
          const transfer = await stripe.transfers.create({
            amount: share,
            currency: "usd",
            destination,
            transfer_group: gigId,
            source_transaction: latestCharge,
          });

          const account = await stripe.accounts.retrieve(destination);

          // Output success
          console.info(
            `transfer to ${
              account.individual?.first_name ?? account.business_profile?.name
            }: `,
            transfer
          );
        }
        break;
      }
      default:
        console.info(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({
      data: null,
      message: "Payment intent created successfully",
    });
  } catch (error: any) {
    return handleRequestError(error, false);
  }
}
