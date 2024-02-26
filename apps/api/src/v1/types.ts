import Stripe from 'stripe';
import ipData from './data/ip-data.json';

export type ExternalAccountObject = Stripe.ExternalAccount['object'];

export type PaymentIntent = Stripe.PaymentIntent;

export type IPData = typeof ipData;
