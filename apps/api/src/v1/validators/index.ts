import { body, header, query } from 'express-validator';
import { validate } from 'deep-email-validator';
import { getUserByEmail } from '../lib/db';
import { isDev } from '@get-all-work-done/shared/constants';
import { ExternalAccountObject } from '../types';

export const emailValidator = () =>
  body('email', 'Please enter a valid email address')
    .isEmail()
    .custom(async (email) => {
      const result = await validate({
        email,
        validateDisposable: !isDev,
        validateMx: true,
        validateRegex: true,
        validateSMTP: true,
        validateTypo: false,
      });

      if (!result.valid) throw new Error('Please enter a real email address');
      return true;
    });

export const emailExistsValidator = () =>
  body('email')
    .custom(async (value) => {
      const user = await getUserByEmail(value);
      if (user)
        throw new Error(
          'An account with this email already exists, please use a different one.'
        );

      return true;
    })
    .normalizeEmail();

export const accountTokenValidator = () =>
  header('account-token', 'Account token is required').notEmpty();

export const accountIdValidator = () =>
  body('account_id', 'account_id is required').isString().exists();

export const externalAccountTokenValidator = () =>
  header(
    'external-account-token',
    'External account token is required'
  ).notEmpty();

export const externalAccountTypeValidator = () =>
  query('type', 'External account type is required')
    .exists()
    .custom((type: ExternalAccountObject) => {
      if (type !== 'bank_account' && type !== 'card')
        throw new Error('Invalid external account type');

      return true;
    });