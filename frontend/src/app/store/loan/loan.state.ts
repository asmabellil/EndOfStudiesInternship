import { Loan } from "src/app/models/loan.model";

export interface LoansList {
    count: number,
    rows: Loan[]
}

export interface Loans {
    loansList: LoansList,
    allLoans: LoansList
}

export const initialLoans: Loans = {
    loansList: {
        count: null,
        rows: []
    },
    allLoans: {
        count: null,
        rows: []
    }
}