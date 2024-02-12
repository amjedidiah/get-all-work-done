import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { stripe } from '../../lib/stripe';
import User from '../../models/user';
import { handleResponseError, handleValidationErrors } from '../../utils';

export const postRegister = async (request: Request, response: Response) => {
  try {
    // Validate request
    handleValidationErrors(request);

    const { email } = request.body;
    const { user_id } = await verifyAuth(request);

    const account_token = request.headers['account-token'] as string;
    const person_token = request.headers['person-token'] as string | undefined;

    // ? Create account now with default country US, later on create account with user's country of operation
    const account = await stripe.accounts.create({
      type: 'custom',
      capabilities: {
        tax_reporting_us_1099_misc: {
          requested: true,
        },
        bank_transfer_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
        card_payments: {
          requested: true,
        },
      },
      account_token,
      metadata: {
        user_id,
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'weekly',
            delay_days: 3,
            weekly_anchor: 'friday',
          },
        },
      },
    });
    const account_id = account.id;

    // If person_token is present, associate business with person
    const isPersonTokenValid =
      person_token !== 'undefined' && person_token !== 'null';
    if (person_token && isPersonTokenValid)
      await stripe.accounts.createPerson(account_id, {
        person_token,
      });

    // Store account ID & issuer in DB
    await User.create({
      id: user_id,
      accountId: account_id,
      email,
    });

    response.status(201).json({
      data: { user_id, account },
      message: `Connected account created`,
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};
