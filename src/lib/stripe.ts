import Stripe from 'stripe';
import { gigs } from '../constants';
import { HttpError } from '../utils';
import { StripeAccount, TaxSettings } from '../types';
import User from '../models/user';
import { addUsersCredit } from './db';
import logger from '../config/logger';

type Contractor = {
  id: string;
  isSettled: boolean;
};

type ContractorWithShares = Contractor & {
  percentageShare: number;
};

type ContractorWithCredit = ContractorWithShares & {
  credit: number;
};

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const updateContractorsWithCredit = async (
  contractors: ContractorWithShares[]
) => {
  const users = await User.findAll({
    where: {
      accountId: contractors.map(({ id }) => id),
    },
  });

  return [...contractors].map((contractor, index) => ({
    ...contractor,
    credit: users[index].credit,
  })) as ContractorWithCredit[];
};

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

const verifyAndFetchGig = (gigId: string) => {
  // * Replace this with actual call to the DB
  const gig = gigs.find((gig) => gig.id === gigId);
  if (!gig) throw new HttpError(404, 'Gig not found');

  logger.info(`gig: ${JSON.stringify(gig)}`);
  if (gig.status === 'settled')
    throw new HttpError(400, 'Gig is already settled');
  if (gig.status !== 'completed')
    throw new HttpError(400, 'Gig is not completed');

  return gig;
};

export const handleGigTransfer = async (
  gigId: string,
  paymentIntent: Stripe.PaymentIntent
) => {
  const latestCharge = paymentIntent.latest_charge as string;

  // Get the particular gig
  const gig = verifyAndFetchGig(gigId);

  // Get contractor account IDs for this gig
  const contractors = gig.contractors;
  if (!contractors.length)
    throw new HttpError(400, 'No contractor found for this gig');
  logger.info(`contractors: ${JSON.stringify(contractors)}`);

  // Calculate amount to be shared
  const balance = Math.floor(
    (1 - gig.platformFeePercentage) * paymentIntent.amount
  );

  // Update contractors with shares
  const updatedContractors = updateContractorsWithShares(contractors);
  logger.info(`updatedContractors: ${JSON.stringify(updatedContractors)}`);

  // Update contractors with credit
  const contractorsWithCredit = await updateContractorsWithCredit(
    updatedContractors
  );
  logger.info(
    `contractorsWithCredit: ${JSON.stringify(contractorsWithCredit)}`
  );

  // Make the necessary transfers
  for (const contractor of contractorsWithCredit) {
    // Get contractor share
    const share = Math.floor(contractor.percentageShare * balance);
    const updatedShared = share - contractor.credit;
    const recoveredCredit = Math.min(share, contractor.credit);

    // Console if credit
    if (recoveredCredit)
      logger.info(`Recovered credit: ${recoveredCredit} from ${contractor.id}`);

    // If share is 0, skip this contractor
    if (updatedShared <= 0) {
      logger.info(
        `No share for ${contractor.id}, because share: ${share} is same as or less than credit: ${contractor.credit}`
      );
    } else {
      // Set destination account ID
      const destination = contractor.id;

      //Transfer
      const transfer = await stripe.transfers.create({
        amount: updatedShared,
        currency: 'usd',
        destination,
        transfer_group: gigId,
        source_transaction: latestCharge,
      });

      // Output success
      logger.info(`transfer to ${destination}: ${JSON.stringify(transfer)}`);
    }

    // Update contractor credit in DB
    await User.decrement(
      { credit: Math.abs(recoveredCredit) },
      { where: { accountId: contractor.id } }
    );

    // * DB call to update contractors status in gig to settled
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

export const calculateTax = async (amount: number) => {
  // Fetch customer's IP address for Tax calculation
  const res = await fetch('https://api.ipify.org/?format=json');
  const ipData: { ip: string } = await res.json();

  if (!ipData.ip) throw new HttpError(404, 'IP address not found');

  // Calculate tax
  const calculation = await stripe.tax.calculations.create({
    currency: 'usd',
    line_items: [
      {
        amount,
        reference: 'L1',
      },
    ],
    customer_details: {
      ip_address: ipData.ip,
    },
  });
  logger.info(`Tax calculation completed: ${JSON.stringify(calculation)}`);

  return calculation;
};

export const handleRefundTransfers = async (
  transfer_group: string | null,
  refund_reason: string
) => {
  if (!transfer_group)
    throw new HttpError(
      400,
      'Cannot reverse this payment because no transfers were found'
    );

  // Get all the transfers associated with the charge
  const transfers = await stripe.transfers.list({
    limit: 100,
    transfer_group,
  });
  logger.info(
    `${transfers.data.length} transfers found for this charge. Attempting reversal...`
  );

  let monitoredTransfers = [...transfers.data];
  const transferReversals = [];
  try {
    for (const transfer of transfers.data) {
      // Reverse the transfer
      const transferReversal = await stripe.transfers.createReversal(
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
      logger.info(
        `Transfer reversed successfully for ${
          transferReversals.length
        } transfer: ${JSON.stringify(transferReversal)}`
      );
    }
  } catch (error) {
    const accountsWithCredit = monitoredTransfers.map((item) => ({
      accountId: item.destination as string,
      credit: item.amount,
    }));
    const owingAccounts = accountsWithCredit.map((item) => item.accountId);
    const amounts = accountsWithCredit.map((item) => item.credit);

    // Add the amounts to the account as a credit
    await addUsersCredit(accountsWithCredit);

    throw new HttpError(
      400,
      `Failed to refund transfers for the following accounts: ${owingAccounts.join(
        ', '
      )}. The amounts: ${amounts.join(
        ', '
      )} have been added to the accounts as a credit.`
    );
  }

  return transferReversals;
};

export const handleStripeAccountUpdated = async (
  stripeAccount: StripeAccount
) => logger.info(JSON.stringify(stripeAccount));

export const handleStripeTaxSettingsUpdated = async (
  taxSettings: TaxSettings
) => logger.info(JSON.stringify(taxSettings));
