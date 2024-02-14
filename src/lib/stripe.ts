import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import { IPData, PaymentIntent } from "@/types";
import { gigs } from "@/constants";
import { updateContractorsWithShares } from "@/utils";
import { addUsersCredit } from "@/lib/db";

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

export const handleTaxTransaction = async (
  reference: string,
  calculation: string
) => {
  // Create tax transaction
  const transaction = await stripeSecret.tax.transactions.createFromCalculation(
    {
      calculation,
      reference,
      expand: ["line_items"],
    }
  );
  console.info("Tax transaction created: ", transaction);

  // Store transaction ID in Payment Intent
  await stripeSecret.paymentIntents.update(reference, {
    metadata: {
      tax_transaction: transaction.id,
    },
  });
  console.info(
    "Payment intent updated with tax transaction ID: ",
    transaction.id
  );
};

export const handlePaymentIntentSucceeded = async (
  paymentIntent: PaymentIntent
) => {
  // Get necessary info from payment intent
  const gigId = paymentIntent.transfer_group;
  if (!gigId) return;
  console.info("Payment succeeded for gig: ", gigId);

  await handleTaxTransaction(
    paymentIntent.id,
    paymentIntent.metadata.tax_calculation
  );
  await handleGigTransfer(gigId, paymentIntent);
};

export const calculateTax = async (amount: number) => {
  // Fetch customer's IP address for Tax calculation
  const ipData: IPData = await fetch("https://ipapi.co/json/").then((res) =>
    res.json()
  );
  if (!ipData.ip) throw { message: "IP address not found", statusCode: 404 };

  // Calculate tax
  const calculation = await stripeSecret.tax.calculations.create({
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
  console.info("Tax calculation completed: ", calculation);

  return calculation;
};

export const handleRefundTransfers = async (
  transfer_group: string | null,
  refund_reason: string
) => {
  if (!transfer_group)
    throw {
      statusCode: 400,
      message: "Cannot reverse this payment because no transfers were found",
    };

  // Get all the transfers associated with the charge
  const transfers = await stripeSecret.transfers.list({
    limit: 100,
    transfer_group,
  });
  console.info(
    `${transfers.data.length} transfers found for this charge. Attempting reversal...`
  );

  let monitoredTransfers = [...transfers.data];
  let transferReversals = [];
  try {
    for (let transfer of transfers.data) {
      // Reverse the transfer
      const transferReversal = await stripeSecret.transfers.createReversal(
        transfer.id,
        {
          description: `Refund: ${refund_reason}`,
          amount: 10000,
        }
      );

      // Add to list of reversals
      transferReversals.push(transferReversal);

      // Remove transfer from list of monitored transfers
      monitoredTransfers = monitoredTransfers.filter(
        (monitoredTransfer) => monitoredTransfer.id !== transfer.id
      );
      console.info(
        `Transfer reversed successfully for ${transferReversals.length} transfer: `,
        transferReversal
      );
    }
  } catch (error) {
    const accountsWithCredit = monitoredTransfers.map((item) => ({
      accountId: item.destination!.toString(),
      credit: item.amount,
    }));
    const owingAccounts = accountsWithCredit.map((item) => item.accountId);
    const amounts = accountsWithCredit.map((item) => item.credit);

    // Add the amounts to the account as a credit
    await addUsersCredit(accountsWithCredit);

    throw {
      message: `Failed to refund transfers for the following accounts: ${owingAccounts.join(
        ", "
      )}. The amounts: ${amounts.join(
        ", "
      )} have been added to the accounts as a credit.`,
      statusCode: 400,
    };
  }

  return transferReversals;
};
