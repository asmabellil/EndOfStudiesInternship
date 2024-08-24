import { Model, DataTypes } from 'sequelize';

export default class Echance extends Model {
  static associate(models) {
    // Define associations here
    Echance.belongsTo(models.Pret, {
      foreignKey: 'pretId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  public id!: number;

  public pretId!: number;

  public dateEchance!: Date;

  public montantRembourse!: number;

  public createdAt!: Date;

  public updatedAt!: Date; 
}

export const initEchance = (sequelize) => {
  Echance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pretId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Prets',
          key: 'id',
        },
      },
      dateEchance: DataTypes.DATE,
      montantRembourse: DataTypes.FLOAT,
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
      modelName: 'Echance',
      tableName: 'Echances',
    },
  );

  return Echance;
};
