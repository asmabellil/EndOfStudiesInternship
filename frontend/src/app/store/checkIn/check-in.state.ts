import { CheckIn } from "src/app/models/check-in.model"
import { User } from "src/app/models/user.model"

export interface CheckInList {
    count: number,
    rows: CheckIn[]
}

export interface CheckIns {
    checkInsList: CheckInList,
    checkInSelectedUser: User,
}

export const initialCheckIns: CheckIns = {
    checkInsList: {
        count: null,
        rows: []
    },
    checkInSelectedUser: null
}