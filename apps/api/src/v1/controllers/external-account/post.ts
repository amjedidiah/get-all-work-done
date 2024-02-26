import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleGetUserById } from '../../lib/db';
import { handleResponseError, handleValidationErrors } from '../../utils';
import { stripe } from '../../lib/stripe';

const postExternalAccount = async (request: Request, response: Response) => {
  try {
    // Validate request
    handleValidationErrors(request);

    const { user_id } = await verifyAuth(request);
    const user = await handleGetUserById(user_id);

    const externalAccount = await stripe.accounts.createExternalAccount(
      user.accountId,
      {
        external_account: request.headers['external-account-token'] as string,
      }
    );

    response.status(201).json({
      data: {
        externalAccount,
      },
      message: 'External account created successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postExternalAccount;
