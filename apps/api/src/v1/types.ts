import Stripe from 'stripe';
import ipData from './data/ip-data.json';

export type ExternalAccountObject = Stripe.ExternalAccount['object'];

export type PaymentIntent = Stripe.PaymentIntent;

export type IPData = typeof ipData;

export type AccountWithCredit = {
  accountId: string;
  credit: number;
};

export type StripeAccount = Stripe.Account;

export type TaxSettings = Stripe.TaxSettingsUpdatedEvent['data']['object'];
