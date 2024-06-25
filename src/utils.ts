import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { stripe } from './lib/stripe';
import User from './models/user';
import { isDev } from './constants';
import logger from './config/logger';

const DEFAULT_ERROR_STATUS_CODE = 500;

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export const handleResponseError = (res: Response, error: any) => {
  const code =
    error instanceof HttpError ? error.status : DEFAULT_ERROR_STATUS_CODE;

  logger.error(error);

  res
    .status(code)
    .json({ data: null, message: (error as Error).message, error: true });
  res.end();
};

export const handleValidationErrors = (request: Request) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    throw new HttpError(400, errors.array()[0]?.msg || 'Bad request');
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const performConnectRequest = async (request: Request, user: User) => {
  const { object, action } = request.params;
  const values = request.method === 'GET' ? request.query : request.body;

  const initMethodParams = [
    values,
    {
      stripeAccount: user.accountId,
    },
  ];

  const methodParams =
    request.method === 'PATCH'
      ? [request.query.id, ...initMethodParams]
      : initMethodParams;

  let data;
  if ((object as string).includes('.')) {
    const [stripeObject, stripeObjectParam] = (object as string).split('.');
    data = await (stripe[stripeObject as keyof typeof stripe] as any)[
      stripeObjectParam
    ][action](...methodParams);
  } else {
    data = await (stripe as Record<string, any>)[object][action](
      ...methodParams
    );
  }

  return { data, code: request.method === 'POST' ? 201 : 200 };
};

export const prepWebhookEvent = (
  request: Request,
  secret = process.env.STRIPE_ENDPOINT_SECRET as string
) => {
  const sig = request.headers['stripe-signature'] as string;
  const event = stripe.webhooks.constructEvent(request.body, sig, secret);

  // Check if the webhook is in live mode to handle effectively
  const isLiveMode = event.livemode;
  if (!isDev && !isLiveMode)
    throw new HttpError(400, 'Webhook is not in live mode');

  return event;
};
