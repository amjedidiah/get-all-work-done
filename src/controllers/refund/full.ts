import { Request, Response } from 'express';
import {
  HttpError,
  handleResponseError,
  handleValidationErrors,
} from '../../utils';
import { handleRefundTransfers, stripe } from '../../lib/stripe';
import logger from '../../config/logger';

const postFullRefund = async (request: Request, response: Response) => {
  try {
    // Validate request
    handleValidationErrors(request);

    const { refund_reason, payment_intent_id } = request.body;
    // Refund reason must be one of: duplicate, fraudulent, requested_by_customer

    // Get the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (!paymentIntent.latest_charge)
      throw new HttpError(
        400,
        'Cannot reverse this payment because no charge was found'
      );

    // Refund the charge
    const refund = await stripe.refunds.create({
      charge: paymentIntent.latest_charge.toString(),
      reason: refund_reason,
    });
    logger.info('Charge refunded successfully: ', refund);

    // Reverse the tax transaction
    const taxTransactionReversal = await stripe.tax.transactions.createReversal(
      {
        mode: 'full',
        original_transaction: paymentIntent.metadata.tax_transaction,
        reference: `${paymentIntent.id}-full-refund`,
        metadata: {
          refund: refund.id,
          refund_reason,
        },
        expand: ['line_items'],
      }
    );
    logger.info(
      'Tax transaction reversed successfully: ',
      taxTransactionReversal
    );

    const transfer_reversals = await handleRefundTransfers(
      paymentIntent.transfer_group,
      refund_reason
    );

    response.status(200).json({
      data: {
        refund,
        tax_transaction_reversal: taxTransactionReversal,
        transfer_reversals,
      },
      message: 'All refunds done successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postFullRefund;
