import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentIntent } from "@/types";
import { gigs } from "@/constants";
import { updateContractorsWithShares } from "@/utils";

export const stripePublishable = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export const stripeSecret = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const handleGigTransfer = async (
  gigId: string,
  paymentIntent: PaymentIntent
) => {
  const latestCharge = paymentIntent.latest_charge as string;

  // Get the particular gig
  const gig = gigs.find((gig) => gig.id === gigId);
  if (!gig)
    throw {
      status: 404,
      message: "Gig not found",
    };
  console.info("gig: ", gig);

  const gigIsDone = gig.status === "completed";
  if (!gigIsDone)
    throw {
      status: 400,
      message: "Gig is not completed",
    };

  // Get contractor account IDs for this gig
  const contractors = gig.contractors;
  if (!contractors.length)
    throw {
      status: 400,
      message: "No contractor found for this gig",
    };
  console.info("contractors: ", contractors);

  // Calculate amount to be shared
  const balance = Math.floor(
    (1 - gig.platformFeePercentage) * paymentIntent.amount
  );

  // Update contractors with shares
  const updatedContractors = updateContractorsWithShares(contractors);
  console.info("updatedContractors: ", updatedContractors);

  // Make the necessary transfers
  for (const contractor of updatedContractors) {
    // Get contractor share
    const share = Math.floor(contractor.percentageShare * balance);

    // Set destination account ID
    const destination = contractor.id;

    //Transfer
    const transfer = await stripeSecret.transfers.create({
      amount: share,
      currency: "usd",
      destination,
      transfer_group: gigId,
      source_transaction: latestCharge,
    });

    const account = await stripeSecret.accounts.retrieve(destination);

    // Output success
    console.info(
      `transfer to ${
        account.individual?.first_name ?? account.business_profile?.name
      }: `,
      transfer
    );

    // TODO: DB call to update contractors status to settled
  }

  // TODO: DB call to update gig status to settled
};

export const handlePaymentIntentSucceeded = async (
  paymentIntent: PaymentIntent
) => {
  // Get necessary info from payment intent
  const gigId = paymentIntent.transfer_group;
  if (!gigId) return;

  await handleGigTransfer(gigId, paymentIntent);
};
