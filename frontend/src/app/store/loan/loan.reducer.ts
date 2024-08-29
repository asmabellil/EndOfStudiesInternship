import { createReducer, on } from "@ngrx/store";
import { initialLoans } from "./loan.state";
import { getAllLoansSuccess, getLoansByUserIdSuccess } from "./loan.actions";
import { disconnectUser } from "../user/user.actions";

export const loansReducer = createReducer(
    initialLoans,

    on(getAllLoansSuccess, (state, { count, rows }) => ({...state, allLoans: { count, rows }})),

    on(getLoansByUserIdSuccess, (state, { count, rows }) => ({...state, loansList: { count, rows }})),
);