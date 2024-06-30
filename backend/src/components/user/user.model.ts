import { Model, DataTypes, Association } from 'sequelize';

export default class User extends Model {
  static associate(models) {
    // Define associations here
    // User.belongsTo(models.Company);
  }
  public id!: number;

  resetToken: string;

  password: string;

  companyId: number;

  resetCode: number;

  resetCodeExpiry: Date;

  role : string;

  public static associations: {
  };
}

export const initUser = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      language: DataTypes.STRING,
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: DataTypes.STRING,
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetCodeExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // companyId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
    },
  );

  return User;
};
