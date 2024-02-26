import User from '../models/user';
import { AccountWithCredit } from '../types';
import { HttpError } from '../utils';

export const getUserByEmail = (email: string) =>
  User.findOne({
    where: {
      email,
    },
  });

const getUserById = (id: string) =>
  User.findOne({
    where: {
      id,
    },
  });

export const handleGetUserById = async (id: string) => {
  const user = await getUserById(id);
  if (!user) throw new HttpError(404, 'User not found');

  return user;
};

const handleUpdateUserCredit = async (credit: number, accountId: string) =>
  User.increment({ credit }, { where: { accountId } });

export const addUsersCredit = async (users: AccountWithCredit[]) => {
  for (const user of users)
    await handleUpdateUserCredit(user.credit, user.accountId);
};
