import { DateSpecification } from "./enums/date-specification.enum";
import { LeaveStatus } from "./enums/leave-status.enum";
import { LeaveType } from "./enums/leave-type.enum";

export class Leave {
    id: number;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    startDateSpecification: DateSpecification;
    endDateSpecification: DateSpecification;
    reason: string;
    rejectionReason: string;
    status: LeaveStatus;
    daysNumber: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
