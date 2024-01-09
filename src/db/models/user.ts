import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/db/models";

class User extends Model {
  public id!: string;
  public accountId!: string;
  public email!: string;
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
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
