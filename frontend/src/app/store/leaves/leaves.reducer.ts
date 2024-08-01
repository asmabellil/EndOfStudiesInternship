import { createReducer, on } from "@ngrx/store";
import { initialLeaves } from "./leaves.state";
import { getAllLeavesSuccess, getLeavesByUserIdSuccess } from "./leaves.actions";
import { disconnectUser } from "../user/user.actions";

export const leavesReducer = createReducer(
    initialLeaves,

    on(getAllLeavesSuccess, (state, {count, rows}) => ({ ...state, leavesList: { count: count, rows: rows }})),

    on(getLeavesByUserIdSuccess, (state, { leaves }) => ({...state, currentUserLeaves: leaves})),

    on(disconnectUser, (state) => (initialLeaves)),

);