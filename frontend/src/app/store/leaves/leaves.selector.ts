import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const selectLeaves = (state: AppState) => state.leaves;

export const selectLeavesList = createSelector(
    selectLeaves,
    (leaves) => leaves.leavesList?.rows
)

export const selectCurrentUserLeaves = createSelector(
    selectLeaves,
    (leaves) => leaves.currentUserLeaves
)