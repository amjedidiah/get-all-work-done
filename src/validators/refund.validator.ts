import {
  amountValidator,
  paymentIntentValidator,
  refundReasonValidator,
} from './';

export const fullRefundValidator = [
  refundReasonValidator(),
  paymentIntentValidator(),
];

export const partialRefundValidator = [
  ...fullRefundValidator,
  amountValidator(),
];
