/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { handleResponseError } from '../../utils';
import { stripe } from '../../lib/stripe';
import { verifyAuth } from '../../lib/auth';
import { handleGetUserById } from '../../lib/db';

const postConnect = async (request: Request, response: Response) => {
  try {
    const { user_id } = await verifyAuth(request);

    const user = await handleGetUserById(user_id);

    const { body, params } = request;
    const { object, action } = params;

    let data;
    if ((object as string).includes('.')) {
      const [stripeObject, stripeObjectBody] = (object as string).split('.');
      data = await (stripe[stripeObject as keyof typeof stripe] as any)[
        stripeObjectBody
      ][action](params, {
        stripeAccount: user.accountId,
      });
    } else {
      data = await (stripe as Record<string, any>)[object][action](body, {
        stripeAccount: user.accountId,
      });
    }

    response.status(200).json({
      data,
      message: `${object} ${action}'d successfully`,
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postConnect;
