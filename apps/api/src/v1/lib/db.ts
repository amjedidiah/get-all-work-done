import User from '../models/user';

export const getUserByEmail = (email: string) =>
  User.findOne({
    where: {
      email,
    },
  });
