import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleResponseError } from '../../utils';
import { HttpError } from '../../utils';
import { stripe } from '../../lib/stripe';
import { handleGetUserById } from '../../lib/db';

const getAccount = async (request: Request, response: Response) => {
  try {
    const { user_id } = await verifyAuth(request);
    const user = await handleGetUserById(user_id);

    const account = await stripe.accounts.retrieve(user.accountId);
    if (!account) throw new HttpError(404, 'Stripe account not found');

    response.status(200).json({
      data: {
        user,
        account,
      },
      message: 'User retrieved successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default getAccount;
