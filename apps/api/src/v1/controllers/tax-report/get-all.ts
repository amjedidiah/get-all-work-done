import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleGetUserById } from '../../lib/db';
import { handleResponseError } from '../../utils';
import { stripe } from '../../lib/stripe';

const getTaxReports = async (request: Request, response: Response) => {
  try {
    const { user_id } = await verifyAuth(request);
    const user = await handleGetUserById(user_id);

    const { data: reports } = await stripe.reporting.reportRuns.list();
    const filteredReports = reports.filter(
      (report) => report.parameters.connected_account === user.accountId
    );

    response.status(200).json({
      data: { reports: filteredReports },
      message: 'Tax reports fetched successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default getTaxReports;
