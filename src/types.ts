import Stripe from 'stripe';

export type ExternalAccountObject = Stripe.ExternalAccount['object'];

export type PaymentIntent = Stripe.PaymentIntent;

export type AccountWithCredit = {
  accountId: string;
  credit: number;
};

export type StripeAccount = Stripe.Account;

export type TaxSettings = Stripe.TaxSettingsUpdatedEvent['data']['object'];
