import { Model, DataTypes } from 'sequelize';

export default class CheckIn extends Model {
  static associate(models) {
    // Define associations here
    CheckIn.belongsTo(models.User, { 
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  public id!: number;
  public checkInType!: string;
  public checkInDate!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
  public userId!: number;
}

export const initCheckIn = (sequelize) => {
  CheckIn.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      checkInType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      checkInDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'CheckIn',
      tableName: 'CheckIns',
      timestamps: true,
    },
  );

  return CheckIn;
};
