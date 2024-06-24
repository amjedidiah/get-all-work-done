import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleGetUserById } from '../../lib/db';
import { handleResponseError } from '../../utils';
import { stripe } from '../../lib/stripe';

const patchExternalAccount = async (request: Request, response: Response) => {
  try {
    const { user_id } = await verifyAuth(request);
    const user = await handleGetUserById(user_id);

    const updated = await stripe.accounts.updateExternalAccount(
      user.accountId,
      request.params.slug,
      {
        default_for_currency: true,
      }
    );

    response.status(200).json({
      data: { updated },
      message: 'External account has been made default',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default patchExternalAccount;
