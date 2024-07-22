export interface ILeave {
  id: number;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: string;
  userId: number;
  daysNumber: number;
  startDateSpecification: string;
  endDateSpecification: string;
}
