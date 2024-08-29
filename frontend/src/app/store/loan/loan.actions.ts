import { createAction, props } from "@ngrx/store";
import { Loan } from "src/app/models/loan.model";

export const getAllLoans = createAction('[AdminLoansComponent] getAllLoans');

export const getAllLoansSuccess = createAction('[LoansEffects] getAllLoansSuccess', props<{ count: number, rows: any[] }>());

export const getAllLoansFailure = createAction('[LoansEffects] getAllLoansFailure', props<{ error: any }>());

export const getLoansByUserId = createAction('[EmployeeLoansComponent] getLoanByUserId');

export const getLoansByUserIdSuccess = createAction('[LoansEffects] getLoansByUserIdSuccess', props<{ count: number, rows: any[] }>());

export const getLoansByUserIdFailure = createAction('[LoansEffects] getLoansByUserIdFailure', props<{ error: any }>());

export const createLoan = createAction('[EmployeeLoansComponent] createLoan', props<{ loan: Loan }>());

export const createLoanFailure = createAction('[LoansEffects] createLoanFailure', props<{ error: any }>());

export const updateLoan = createAction('[EmployeeLoansComponent] updateLoan', props<{ loan: Loan }>());

export const updateLoanFailure = createAction('[LoansEffects] updateLoanFailure', props<{ error: any }>());

export const deleteLoan = createAction('[EmployeeLoansComponent] deleteLoan', props<{ loanId: number }>());

export const deleteLoanFailure = createAction('[LoansEffects] deleteLoanFailure', props<{ error: any }>());

export const generateAndDownloadPDF = createAction('[EmployeeLoansComponent] generateAndDownloadPDF', props<{ loanId: number }>());

export const generateAndDownloadPDFFailure = createAction('[LoansEffects] generateAndDownloadPDFFailure', props<{ error: any }>());