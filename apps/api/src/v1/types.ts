import Stripe from 'stripe';

export type ExternalAccountObject = Stripe.ExternalAccount['object'];

export type PaymentIntent = Stripe.PaymentIntent;
