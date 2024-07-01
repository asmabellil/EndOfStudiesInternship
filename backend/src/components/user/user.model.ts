import { Model, DataTypes, Association } from 'sequelize';

export default class User extends Model {
  static associate(models) {
    // Define associations here
    // User.belongsTo(models.Company);
  }
  public id!: number;

  resetToken: string;

  password: string;

  jobRef: string;

  jobTitle: string;

  firstName: Date;

  lastName : string;

  email: string;

  phoneNumber: string;

  gender: string;

  role: string;

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
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jobRef: DataTypes.STRING,
      jobTitle: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.STRING,
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
