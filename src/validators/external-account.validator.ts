import {
  externalAccountTokenValidator,
  externalAccountTypeValidator,
} from './';

export const postExternalAccountValidator = [externalAccountTokenValidator()];

export const getExternalAccountValidator = [externalAccountTypeValidator()];
