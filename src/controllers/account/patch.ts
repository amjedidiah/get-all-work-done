import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleResponseError } from '../../utils';
import { stripe } from '../../lib/stripe';
import { handleGetUserById } from '../../lib/db';

const patchAccount = async (request: Request, response: Response) => {
  try {
    const { dbUpdate, stripeUpdate } = request.body;
    const { user_id } = await verifyAuth(request);

    const user = await handleGetUserById(user_id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const key in dbUpdate) (user as any)[key] = dbUpdate[key];
    await user.save();

    let stripeAccount;
    if (stripeUpdate)
      stripeAccount = await stripe.accounts.update(
        user.accountId,
        stripeUpdate
      );

    response.status(200).json({
      data: {
        user: user.dataValues,
        account: stripeAccount,
      },
      message: `User has been updated successfully`,
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default patchAccount;
