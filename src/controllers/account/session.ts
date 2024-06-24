import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleResponseError } from '../../utils';
import { stripe } from '../../lib/stripe';

type AccountSession = {
  account_id: string;
};

const postAccountSession = async (request: Request, response: Response) => {
  try {
    await verifyAuth(request);
    const { account_id: account }: AccountSession = request.body;

    const accountSession = await stripe.accountSessions.create({
      account,
      components: {
        account_onboarding: {
          enabled: true,
        },
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
          },
        },
        payouts: {
          enabled: true,
        },
      },
    });

    response.status(201).json({
      data: { client_secret: accountSession.client_secret },
      message: `Account session created successfully for ${account}`,
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postAccountSession;
