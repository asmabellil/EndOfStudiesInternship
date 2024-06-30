import { Model, DataTypes } from 'sequelize';
import User from './user.model';

export default class Schedule extends Model {
    public id!: number;
    public day: string;
    public startTime: string;
    public endTime: string;
    public userId: number;
}

export const initSchedule = (sequelize: any) => {

    Schedule.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            day: {
                type: DataTypes.STRING,
                values: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
                allowNull: false,
            },
            startTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            endTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                }
            }
        },
        {
            sequelize,
            modelName: 'Schedule',
            tableName: 'Schedule',
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'day'],
                }
            ],
        },
    );

    return Schedule;
};
