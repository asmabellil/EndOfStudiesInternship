import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const selectCheckIns = (state: AppState) => state.checkIns;

export const selectCheckInsList = createSelector(
    selectCheckIns,
    (checkIns) => checkIns.checkInsList?.rows
)

export const selectCheckInSelectedUser = createSelector(
    selectCheckIns,
    (checkIns) => checkIns.checkInSelectedUser
)