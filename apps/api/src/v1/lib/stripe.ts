import Stripe from 'stripe';
import { gigs } from '@get-all-work-done/shared/constants';
import { HttpError } from '../utils';

type Contractor = {
  id: string;
  isSettled: boolean;
};

type ContractorWithShares = Contractor & {
  percentageShare: number;
};

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const updateContractorsWithShares = (
  contractors: Array<Contractor | ContractorWithShares>
) => {
  let updatedContractors = [...contractors];

  // If no shares for all contractors
  if (contractors.every((contractor) => !('percentageShare' in contractor)))
    updatedContractors = updatedContractors.map((contractor) => ({
      ...contractor,
      percentageShare: (1 / contractors.length).toFixed(2),
    }));
  // If shares for some contractors
  else if (contractors.some((contractor) => 'percentageShare' in contractor)) {
    const totalPercentage = updatedContractors.reduce((total, contractor) => {
      if (!('percentageShare' in contractor)) return total;
      return total + contractor.percentageShare;
    }, 0);
    const balancePercentage = 1 - totalPercentage;
    const contractorsWithoutShares = updatedContractors.filter(
      (contractor) => !('percentageShare' in contractor)
    ).length;

    updatedContractors = updatedContractors.map((contractor) => {
      if (!('percentageShare' in contractor))
        return {
          ...contractor,
          percentageShare: (
            balancePercentage / contractorsWithoutShares
          ).toFixed(2),
        };
      return contractor;
    });
  }

  return updatedContractors.filter(
    ({ isSettled }) => !isSettled
  ) as ContractorWithShares[];
};

export const handleGigTransfer = async (
  gigId: string,
  paymentIntent: Stripe.PaymentIntent
) => {
  const latestCharge = paymentIntent.latest_charge as string;

  // Get the particular gig
  const gig = gigs.find((gig) => gig.id === gigId);
  if (!gig) throw new HttpError(404, 'Gig not found');

  console.info('gig: ', gig);

  const gigIsDone = gig.status === 'completed';
  if (!gigIsDone) throw new HttpError(400, 'Gig is not completed');

  // Get contractor account IDs for this gig
  const contractors = gig.contractors;
  if (!contractors.length)
    throw new HttpError(400, 'No contractor found for this gig');
  console.info('contractors: ', contractors);

  // Calculate amount to be shared
  const balance = Math.floor(
    (1 - gig.platformFeePercentage) * paymentIntent.amount
  );

  // Update contractors with shares
  const updatedContractors = updateContractorsWithShares(contractors);
  console.info('updatedContractors: ', updatedContractors);

  // Make the necessary transfers
  for (const contractor of updatedContractors) {
    // Get contractor share
    const share = Math.floor(contractor.percentageShare * balance);

    // Set destination account ID
    const destination = contractor.id;

    //Transfer
    const transfer = await stripe.transfers.create({
      amount: share,
      currency: 'usd',
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

    // * DB call to update contractors status to settled
  }

  // * DB call to update gig status to settled
};

export const handlePaymentIntentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  // Get necessary info from payment intent
  const gigId = paymentIntent.transfer_group;
  if (!gigId) return;

  await handleGigTransfer(gigId, paymentIntent);
};
