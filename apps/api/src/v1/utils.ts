import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

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
    .status(errorObject.status || 500)
    .json({ data: null, message: errorObject.message });
};

export const handleValidationErrors = (request: Request) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    throw new HttpError(400, errors.array()[0]?.msg || 'Bad request');
};
