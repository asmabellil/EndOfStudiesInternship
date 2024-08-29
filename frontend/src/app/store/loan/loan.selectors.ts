import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const selectLoans = (state: AppState) => state.loans;

export const selectLoansList = createSelector(
    selectLoans,
    (loans) => loans.loansList?.rows
)

export const selectAllLoansList = createSelector(
    selectLoans,
    (loans) => loans.allLoans?.rows
)