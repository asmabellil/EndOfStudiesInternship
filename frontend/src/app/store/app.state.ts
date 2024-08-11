import { CheckIns } from "./checkIn/check-in.state";
import { Leaves } from "./leaves/leaves.state";
import { Users } from "./user/user.state";

export interface AppState {
    users: Users,
    leaves: Leaves,
    checkIns: CheckIns
}

export const initialAppState: AppState = {
  users: null,
  leaves: null,
  checkIns: null
};