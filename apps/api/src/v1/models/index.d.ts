declare module './' {
  import { Sequelize } from 'sequelize';
  import { Model } from 'sequelize/types';

  interface UserAttributes {
    id: string;
    accountId: string;
    email: string;
    isOnboarded: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  class User extends Model<UserAttributes> {
    public id!: string;
    public accountId!: string;
    public email!: string;
    public isOnboarded!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  const sequelize: Sequelize;

  export { User, sequelize };
}

export {};
