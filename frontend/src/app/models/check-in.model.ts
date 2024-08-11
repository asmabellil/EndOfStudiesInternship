import { CheckInType } from "./enums/check-in-type.enum";

export class CheckIn {
    public id!: number;
    public checkInType!: CheckInType;
    public checkInDate!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
    public userId!: number;
}