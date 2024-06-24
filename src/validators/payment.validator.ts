import {
  amountValidator,
  paymentIntentValidator,
  transferGroupValidator,
} from './';

export const postPaymentValidator = [
  amountValidator(),
  transferGroupValidator(),
];

export const patchPaymentValidator = [
  amountValidator(),
  paymentIntentValidator(),
];
