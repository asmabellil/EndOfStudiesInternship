import { Leaves } from "./leaves/leaves.state";
import { Users } from "./user/user.state";

export interface AppState {
    users: Users,
    leaves: Leaves
}

export const initialAppState: AppState = {
  users: null,
  leaves: null
};