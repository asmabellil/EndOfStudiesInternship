import { Leave } from "src/app/models/leave.model";

export interface LeavesList {
    count: number,
    rows: Leave[]
}

export interface Leaves {
    leavesList: LeavesList,
    currentUserLeaves: Leave[]
}

export const initialLeaves: Leaves = {
    currentUserLeaves: null,
    leavesList: {
        count: null,
        rows: []
    }
}