import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { MessageService } from "primeng/api";
import { CheckInService } from "src/app/services/check-in.service";
import { createCheckInForUser, createCheckInForUserFailure, deleteCheckIn, deleteCheckInFailure, getAllCheckIns, getAllCheckInsFailure, getAllCheckInsSuccess, updateCheckIn, updateCheckInForFailure } from "./check-in.actions";
import { mergeMap, map, catchError, of, withLatestFrom } from "rxjs";
import { selectCheckInSelectedUser } from "./check-in.selectors";
import { AppState } from "../app.state";

@Injectable()
export class CheckInsEffects {
  constructor(
    private actions$: Actions,
    private modalService: NgbModal,
    private store: Store<AppState>,
    private messageService: MessageService,
    private checkInService: CheckInService
  ) {}

  getAllCheckIns$ = createEffect(() => this.actions$.pipe(
    ofType(getAllCheckIns),
    mergeMap(() => 
      this.checkInService.getAllCheckIns().pipe(
        map(result => getAllCheckInsSuccess(result.checkIns)),
        catchError((error) => of(getAllCheckInsFailure({ error })))
      )
    )
  ))

  createCheckInForUser$ = createEffect(() => this.actions$.pipe(
    ofType(createCheckInForUser),
    withLatestFrom(this.store.select(selectCheckInSelectedUser)),
    mergeMap(([action, checkInSelectedUser]) => 
      this.checkInService.createCheckIn({ ...action.checkIn, userId: !!action.checkIn.userId ? action.checkIn.userId : checkInSelectedUser.id }).pipe(
        map(result => {
          this.modalService.dismissAll();

          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The check-in has been added successfully!'});
          return getAllCheckIns();
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});
          return of(createCheckInForUserFailure({ error }));
        })
      )
    )
  ))

  updateCheckIn$ = createEffect(() => this.actions$.pipe(
    ofType(updateCheckIn),
    mergeMap((action) => 
      this.checkInService.updateCheckIn(action.checkIn).pipe(
        map(result => {
          this.modalService.dismissAll();

          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The check-in has been updated successfully!'});
          return getAllCheckIns();
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});
          return of(updateCheckInForFailure({ error }));
        })
      )
    )
  ))

  deleteCheckIn$ = createEffect(() => this.actions$.pipe(
    ofType(deleteCheckIn),
    mergeMap((action) => 
      this.checkInService.deleteCheckIn(action.checkInId).pipe(
        map(result => {
          this.modalService.dismissAll();

          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The check-in has been deleted successfully!'});
          return getAllCheckIns();
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});
          return of(deleteCheckInFailure({ error }));
        })
      )
    )
  ))
}