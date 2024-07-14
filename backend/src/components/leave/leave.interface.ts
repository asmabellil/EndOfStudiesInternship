export interface ILeave {
  id: number;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: string;
  userId: number;
}
