import { createReducer, on } from "@ngrx/store";
import { changeCheckInSelectedUser, getAllCheckInsSuccess } from "./check-in.actions";
import { initialCheckIns } from "./check-in.state";

export const checkInsReducer = createReducer(
    initialCheckIns,

    on(getAllCheckInsSuccess, (state, { count, rows }) => ({...state, checkInsList: { count, rows }})),

    on(changeCheckInSelectedUser, (state, { user }) => ({...state, checkInSelectedUser: user}))
);