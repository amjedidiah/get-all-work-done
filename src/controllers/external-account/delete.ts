import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleGetUserById } from '../../lib/db';
import { handleResponseError } from '../../utils';
import { stripe } from '../../lib/stripe';

const deleteExternalAccount = async (request: Request, response: Response) => {
  try {
    const { user_id } = await verifyAuth(request);
    const user = await handleGetUserById(user_id);

    const deleted = await stripe.accounts.deleteExternalAccount(
      user.accountId,
      request.params.slug
    );

    response.status(200).json({
      data: { deleted },
      message: 'External account deleted successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default deleteExternalAccount;
