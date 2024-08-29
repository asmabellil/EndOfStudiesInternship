import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { MessageService } from "primeng/api";
import { catchError, from, map, mergeMap, of, withLatestFrom } from "rxjs";
import { LoanService } from "src/app/services/loan.service";
import { selectCurrentUserId } from "../user/user.selector";
import { createLoan, createLoanFailure, deleteLoan, deleteLoanFailure, generateAndDownloadPDF, generateAndDownloadPDFFailure, getAllLoans, getAllLoansFailure, getAllLoansSuccess, getLoansByUserId, getLoansByUserIdFailure, getLoansByUserIdSuccess, updateLoan, updateLoanFailure } from "./loan.actions";
import { Loan } from "src/app/models/loan.model";

@Injectable()
export class LoansEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private modalService: NgbModal,
    private messageService: MessageService,
    private loanService: LoanService
  ) {}

  getAllLoans$ = createEffect(() => this.actions$.pipe(
    ofType(getAllLoans),
    mergeMap(() => 
      this.loanService.getAllLoans().pipe(
        map(result => getAllLoansSuccess({ count: result.prets.count, rows: result.prets.rows })),
        catchError((error) => of(getAllLoansFailure({ error })))
      )
    )
  ));

  getLoansByUserId$ = createEffect(() => this.actions$.pipe(
    ofType(getLoansByUserId),
    withLatestFrom(this.store.select(selectCurrentUserId)),
    mergeMap(([action, userId]) => 
      this.loanService.getLoansByUserId(userId).pipe(
        map(result => getLoansByUserIdSuccess({ count: result.prets.count, rows: result.prets.rows })),
        catchError((error) => of(getLoansByUserIdFailure({ error })))
      )
    )
  ));

  createLoan$ = createEffect(() => this.actions$.pipe(
    ofType(createLoan),
    withLatestFrom(this.store.select(selectCurrentUserId)),
    mergeMap(([action, userId]) => {
      const loan = { ...action.loan, userId } as Loan;
      return this.loanService.createLoan(loan).pipe(
        map(result => {
          this.modalService.dismissAll();
          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The loan has been added successfully!'});

          return getLoansByUserId();
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});
          return of(createLoanFailure({ error }));
        })
      )
    })
  ));

  updateLoan$ = createEffect(() => this.actions$.pipe(
    ofType(updateLoan),
    mergeMap((action) => {
      const {createdAt, updatedAt, id, montantARemb, montantRembParMois, soldRest, ...loanRest} = action.loan;

      return this.loanService.updateLoan(loanRest as Loan, id).pipe(
        mergeMap(result => {
          this.modalService.dismissAll();
          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The loan has been updated successfully!'});

          return from([getLoansByUserId(), getAllLoans()]);
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});
          return of(updateLoanFailure({ error }));
        })
      )
    })
  ));

  deleteLoan$ = createEffect(() => this.actions$.pipe(
    ofType(deleteLoan),
    mergeMap((action) => 
      this.loanService.deleteLoan(action.loanId).pipe(
        map(result => {
          this.modalService.dismissAll();
          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The loan has been deleted successfully!'});

          return getLoansByUserId();
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});
          return of(deleteLoanFailure({ error }));
        })
      )
    )
  ));

  generateAndDownloadPDF$ = createEffect(() => this.actions$.pipe(
    ofType(generateAndDownloadPDF),
    mergeMap((action) => 
      this.loanService.generatePDF(action.loanId).pipe(
        mergeMap(result => {
          const path = result.filename.substring(2, result.filename.length);
          return this.loanService.downloadPDF(path).pipe(
            map((data) => {
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              window.open(url);
  
              this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The Invoice has been downloaded successfully!'});
            })
          )
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});

          return of(generateAndDownloadPDFFailure({ error }));
        })
      )
    )
  ), { dispatch: false });

}