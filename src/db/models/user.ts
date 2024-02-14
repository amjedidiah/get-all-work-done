import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/db/models";

class User extends Model {
  public id!: string;
  public accountId!: string;
  public email!: string;
  public isOnboarded!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public isVerified!: boolean;
  public credit!: number;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isOnboarded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    credit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
