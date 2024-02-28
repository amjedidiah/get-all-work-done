import { Request, Response } from 'express';
import { handleResponseError, prepWebhookEvent } from '../../utils';

const postWebhook = async (request: Request, response: Response) => {
  try {
    const event = prepWebhookEvent(request);

    // Handle the event
    switch (event.type) {
      default:
        console.info(`Unhandled event type ${event.type}`);
    }

    response.status(200);
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postWebhook;
