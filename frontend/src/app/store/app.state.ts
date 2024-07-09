import { Users } from "./user/user.state";

export interface AppState {
    users: Users
}

export const initialAppState: AppState = {
  users: null,
};