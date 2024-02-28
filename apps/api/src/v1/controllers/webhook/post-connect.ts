import { Request, Response } from 'express';
import { handleResponseError, prepWebhookEvent } from '../../utils';
import {
  handlePaymentIntentSucceeded,
  handleStripeAccountUpdated,
  handleStripeTaxSettingsUpdated,
} from '../../lib/stripe';
import { PaymentIntent, StripeAccount, TaxSettings } from '../../types';

const postConnectWebhook = async (request: Request, response: Response) => {
  try {
    const event = prepWebhookEvent(request);

    // Handle the event
    switch (event.type) {
      case 'account.updated': {
        // Get account
        const account = event.data.object as StripeAccount;

        await handleStripeAccountUpdated(account);
        break;
      }
      case 'tax.settings.updated': {
        // Get account
        const taxSettings = event.data.object as TaxSettings;

        await handleStripeTaxSettingsUpdated(taxSettings);
        break;
      }
      case 'payment_intent.succeeded': {
        // Get payment intent
        const paymentIntent = event.data.object as PaymentIntent;

        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
      default:
        console.info(`Unhandled event type ${event.type}`);
    }

    response.status(200);
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postConnectWebhook;
