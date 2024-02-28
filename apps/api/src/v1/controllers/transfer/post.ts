import { Request, Response } from 'express';
import {
  HttpError,
  handleResponseError,
  handleValidationErrors,
} from '../../utils';
import { handleGigTransfer, stripe } from '../../lib/stripe';

const postTransfer = async (request: Request, response: Response) => {
  try {
    // Validate request
    handleValidationErrors(request);

    const gigId = request.body['gig_id'];

    // Get gig paymentIntent
    const paymentIntentSearch = await stripe.paymentIntents.search({
      query: `metadata["gigId"]:"${gigId}" AND status:"succeeded"`,
    });
    if (!paymentIntentSearch.data.length)
      throw new HttpError(404, 'No payment intent found for this gig');

    const paymentIntent = paymentIntentSearch.data[0];
    await handleGigTransfer(gigId, paymentIntent);

    response.status(200).json({
      message: 'Transfers completed successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postTransfer;
