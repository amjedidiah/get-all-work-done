import { validateInterval } from './';

export const postTaxReportValidator = [
  validateInterval('interval_start', 'interval_start'),
  validateInterval('interval_end', 'interval_end'),
];
