import {
  handlePaymentIntentSucceeded,
  stripeSecret as stripe,
} from "@/lib/stripe";
import {
  PaymentIntent,
  StripeAccount,
  StripeEvent,
  TaxSettings,
} from "@/types";
import { handleRequestError } from "@/utils";
import { NextResponse, type NextRequest } from "next/server";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

const handleStripeAccountUpdated = async (stripeAccount: StripeAccount) => {};

const handleStripeTaxSettingsUpdated = async (stripeAccount: TaxSettings) => {};

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature") as string;
  let event: StripeEvent;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    // Check if the webhook is in live mode to handle effectively
    // const isLiveMode = event.livemode;     // TODO: Handle in deployment

    // Handle the event
    switch (event.type) {
      case "account.updated": {
        // Get account
        const account = event.data.object as StripeAccount;

        await handleStripeAccountUpdated(account);
        break;
      }
      case "tax.settings.updated": {
        // Get account
        const taxSettings = event.data.object as TaxSettings;

        await handleStripeTaxSettingsUpdated(taxSettings);
        break;
      }
      case "payment_intent.succeeded": {
        // Get payment intent
        const paymentIntent = event.data.object as PaymentIntent;

        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
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
