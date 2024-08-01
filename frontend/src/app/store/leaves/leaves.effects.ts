import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { act, Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { MessageService } from "primeng/api";
import { catchError, map, mergeMap, of, withLatestFrom } from "rxjs";
import { LeaveService } from "src/app/services/leave.service";
import { createLeaveForUser, createLeaveForUserFailure, deleteLeave, getAllLeaves, getAllLeavesFailure, getAllLeavesSuccess, getLeavesByUserId, getLeavesByUserIdFailure, getLeavesByUserIdSuccess, updateLeave, updateLeaveForFailure } from "./leaves.actions";
import { selectCurrentUserId } from "../user/user.selector";
import { Leave } from "src/app/models/leave.model";
import * as moment from "moment";


@Injectable()
export class LeavesEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private modalService: NgbModal,
    private messageService: MessageService,
    private leaveService: LeaveService
  ) {}

  getAllLeaves$ = createEffect(() => this.actions$.pipe(
    ofType(getAllLeaves),
    mergeMap(() => 
      this.leaveService.getAllLeaves().pipe(
        map(result => getAllLeavesSuccess(result.leaves)),
        catchError((error) => of(getAllLeavesFailure({ error })))
      )
    )
  ))

  getLeavesByUserId$ = createEffect(() => this.actions$.pipe(
    ofType(getLeavesByUserId),
    mergeMap((action) => 
      this.leaveService.getLeavesByUserId(action.userId).pipe(
        map(result => getLeavesByUserIdSuccess(result)),
        catchError((error) => of(getLeavesByUserIdFailure({ error })))
      )
    )
  ))

  createLeaveForUser$ = createEffect(() => this.actions$.pipe(
    ofType(createLeaveForUser),
    withLatestFrom(this.store.select(selectCurrentUserId)),
    mergeMap(([action, userId]) => 
      this.leaveService.createLeaveForUser({
          ...action.leave, userId, daysNumber: moment(action.leave.endDate).diff(action.leave.startDate, 'days') + 1
        } as Leave).pipe(
        map(result => {
          this.modalService.dismissAll();

          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The leave has been added successfully!'});
          return getLeavesByUserId({ userId });
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});
          return of(createLeaveForUserFailure({ error }))
        })
      )
    )
  ))

  updateLeave$ = createEffect(() => this.actions$.pipe(
    ofType(updateLeave),
    withLatestFrom(this.store.select(selectCurrentUserId)),
    mergeMap(([action, userId]) => {
      const {id, ...leave} = action.leave;
    
      return this.leaveService.updateLeave({ 
        ...leave,
        daysNumber: moment(action.leave.endDate).diff(action.leave.startDate, 'days') + 1
      } as Leave, action.leave.id).pipe(
        map(result => {
          this.modalService.dismissAll();

          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The leave has been updated successfully!'});
          return action.refreshAll ? getAllLeaves() : getLeavesByUserId({ userId: userId });
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});
          return of(updateLeaveForFailure({ error }))
        })
      )
    })
  ))

  deleteLeave$ = createEffect(() => this.actions$.pipe(
    ofType(deleteLeave),
    withLatestFrom(this.store.select(selectCurrentUserId)),
    mergeMap(([action, userId]) => 
      this.leaveService.deleteLeave(action.leaveId).pipe(
        map(result => {
          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The leave has been deleted successfully!'});
          return getLeavesByUserId({ userId });
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.message : error.statusText});
          return of(getLeavesByUserIdFailure({ error }))
        })
      )
    )
  ))
}