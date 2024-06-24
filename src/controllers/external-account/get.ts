import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleResponseError, handleValidationErrors } from '../../utils';
import { HttpError } from '../../utils';
import { stripe } from '../../lib/stripe';
import { handleGetUserById } from '../../lib/db';
import { ExternalAccountObject } from '../../types';

const listExternalAccountsType = async (
  accountId: string,
  type: ExternalAccountObject
) => {
  const account = await stripe.accounts.retrieve(accountId);
  if (!account) throw new HttpError(404, 'Stripe account not found');

  const externalAccounts = account.external_accounts?.data || [];
  const externalAccountsType = externalAccounts.filter(
    ({ object }: { object: ExternalAccountObject }) => object === type
  );

  return externalAccountsType;
};

const getExternalAccount = async (request: Request, response: Response) => {
  try {
    // Validate request
    handleValidationErrors(request);

    const { user_id } = await verifyAuth(request);
    const user = await handleGetUserById(user_id);
    const type = request.query.type as ExternalAccountObject;

    const externalAccountsType = await listExternalAccountsType(
      user.accountId,
      type
    );

    response.status(200).json({
      data: {
        externalAccountsType,
      },
      message: `${type}s retrieved successfully`,
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default getExternalAccount;
