import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { stripe } from './lib/stripe';
import User from './models/user';

type StatusError = Error & {
  status?: number;
  statusCode?: number;
};

export class HttpError extends Error {
  status?: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export const handleResponseError = (response: Response, error: unknown) => {
  let errorObject = {} as HttpError;

  if (typeof error === 'string') errorObject.message = error;
  else if (error instanceof HttpError) errorObject = error;
  else if (error instanceof AxiosError) {
    errorObject.message = error.message;
    errorObject.status = error.status;
  } else if (error instanceof Error) errorObject.message = error.message;

  console.error(error);
  response
    .status(
      errorObject.status ||
        (error as StatusError).status ||
        (error as StatusError).statusCode ||
        500
    )
    .json({ data: null, message: errorObject.message });
};

export const handleValidationErrors = (request: Request) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    throw new HttpError(400, errors.array()[0]?.msg || 'Bad request');
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getConnectData = async (request: Request, user: User) => {
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

  return data;
};


