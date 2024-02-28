import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleGetUserById } from '../../lib/db';
import { HttpError, handleResponseError } from '../../utils';
import { stripe } from '../../lib/stripe';

const getTaxReport = async (request: Request, response: Response) => {
  try {
    const { user_id } = await verifyAuth(request);
    const user = await handleGetUserById(user_id);

    const reportRun = await stripe.reporting.reportRuns.retrieve(
      request.params.id
    );

    if (!reportRun.result?.id) throw new HttpError(404, 'Report not found');
    if (reportRun.parameters.connected_account !== user.accountId)
      throw new HttpError(403, 'Not authorized');

    const fileLink = await stripe.fileLinks.create({
      file: reportRun.result.id,
    });

    response.status(200).json({
      data: { fileLink },
      message: 'Tax report generated successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default getTaxReport;
