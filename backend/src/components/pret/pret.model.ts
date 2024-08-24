import { Model, DataTypes } from 'sequelize';

export default class Pret extends Model {
  static associate(models) {
    // Define associations here
    Pret.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Pret.hasMany(models.Echance, {
      foreignKey: 'pretId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  public id!: number;

  public pretRef!: string;

  public dateObtention!: Date;

  public dateEcheance!: Date;

  public montantPret!: number;

  public montantARemb!: number;

  public montant1ereRemb!: number;

  public montantRembParMois!: number;

  public echanceNumber!: number;

  public soldRest!: number;

  public status!: string;

  public moneyStatus!: boolean;

  public userId!: number;

  public createdAt!: Date;

  public updatedAt!: Date;
}

export const initPret = (sequelize) => {
  Pret.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pretRef: DataTypes.STRING,
      dateObtention: DataTypes.DATE,
      dateEcheance: DataTypes.DATE,
      montantPret: DataTypes.FLOAT,
      montantARemb: DataTypes.FLOAT,
      montant1ereRemb: DataTypes.FLOAT,
      montantRembParMois: DataTypes.FLOAT,
      soldRest: DataTypes.FLOAT,
      echanceNumber: DataTypes.INTEGER,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
      },
      moneyStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: DataTypes.INTEGER,
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
      modelName: 'Pret',
      tableName: 'Prets',
    },
  );

  return Pret;
};
