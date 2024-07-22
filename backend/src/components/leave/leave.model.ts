import { Model, DataTypes } from 'sequelize';

export default class Leave extends Model {
  static associate(models) {
    // Define associations here
    Leave.belongsTo(models.User, { foreignKey: 'userId' });
  }

  public id!: number;

  public leaveType!: string;

  public startDate!: Date;

  public endDate!: Date;

  public startDateSpecification!: string;

  public endDateSpecification!: string;

  public reason!: string;

  public status!: string;

  public daysNumber!: number;

  public createdAt!: Date;

  public updatedAt!: Date;

  public userId!: number;

  public rejectionReason!: string;

}

export const initLeave = (sequelize) => {
  Leave.init(
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
      leaveType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      startDateSpecification: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDateSpecification: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
      },
      daysNumber: {
        type: DataTypes.INTEGER,
      },
      rejectionReason: {
        type: DataTypes.STRING,
        defaultValue: '',
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
      modelName: 'Leave',
      tableName: 'Leaves',
      timestamps: true,
    },
  );

  return Leave;
};
