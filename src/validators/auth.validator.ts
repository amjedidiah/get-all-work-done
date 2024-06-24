import { accountTokenValidator, emailExistsValidator, emailValidator } from '.';

export const registerValidator = [
  emailValidator(),
  emailExistsValidator(),
  accountTokenValidator(),
];
