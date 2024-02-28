import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleGetUserById } from '../../lib/db';
import { handleResponseError, handleValidationErrors } from '../../utils';
import { stripe } from '../../lib/stripe';

const postTaxReport = async (request: Request, response: Response) => {
  try {
    // Validate request
    handleValidationErrors(request);

    const { interval_start, interval_end } = request.body;

    const { user_id } = await verifyAuth(request);
    const user = await handleGetUserById(user_id);

    const report = await stripe.reporting.reportRuns.create({
      report_type: 'connected_account_tax.transactions.itemized.2',
      parameters: {
        interval_start,
        interval_end,
        connected_account: user.accountId,
      },
    });

    response.status(200).json({
      data: { report },
      message: 'Tax report requested',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postTaxReport;
