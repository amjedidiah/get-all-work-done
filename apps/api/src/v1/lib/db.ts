import User from '../models/user';
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
