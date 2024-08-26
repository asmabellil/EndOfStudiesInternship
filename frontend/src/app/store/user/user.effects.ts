import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { MessageService } from "primeng/api";
import { catchError, filter, from, map, mergeMap, of, tap, withLatestFrom } from "rxjs";
import { UserService } from "src/app/services/user.service";
import { changeCheckInSelectedUser } from "../checkIn/check-in.actions";
import * as UserActions from './user.actions';
import { isUserConnected, selectUserRole } from "./user.selector";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router,
    private store: Store,
    private modalService: NgbModal,
    private messageService: MessageService
  ) {}

  connectUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.connectUser),
    mergeMap((action) =>
      this.userService.connect(action.email, action.password).pipe(
        mergeMap((connectResult) =>
          {
            const decodedToken = jwtDecode<JwtPayload>(connectResult.token);
            return this.userService.getUser(decodedToken['userId']).pipe(
              mergeMap((getUserRes) => {
                decodedToken['role'] === 'Admin' ? this.router.navigate(['admin/dashboard']) : this.router.navigate(['employee/home']);
                this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'Welcome !'});

                return from([
                  UserActions.connectUserSuccess({ token: connectResult.token, decodedToken: decodedToken, user: getUserRes.user }),
                  UserActions.getAllUsers(),
                  changeCheckInSelectedUser({ user: getUserRes.user }),
                ])
              })
            )
          }
        ),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.error : error.statusText});
          return of(UserActions.connectUserFailure({ error }))
        })
      )
    )
  ));

  connectViaGoogle$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.connectUserWithGoogle),
    mergeMap((action) =>
      this.userService.connectWithGoogle(action.email).pipe(
        mergeMap((connectResult) => 
        {
          const decodedToken = jwtDecode<JwtPayload>(connectResult.token);
          return this.userService.getUser(decodedToken['userId']).pipe(
            mergeMap((getUserRes) => {
              decodedToken['role'] === 'Admin' ? this.router.navigate(['admin/dashboard']) : this.router.navigate(['employee/home']);
              this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'Welcome to dashboard!'});

              return from([
                UserActions.connectUserSuccess({ token: connectResult.token, decodedToken: decodedToken, user: getUserRes.user }),
                UserActions.getAllUsers(),
                changeCheckInSelectedUser({ user: getUserRes.user }),
              ])
            })
          )
        }
        ),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.error : error.statusText});
          return of(UserActions.connectUserFailure({ error }))
        })
      )
    )
  ));

  getAllUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.getAllUsers),
    withLatestFrom(this.store.select(isUserConnected), this.store.select(selectUserRole)),
    filter(([_, isUserConnected, role]) => role === 'Admin' && isUserConnected),
    mergeMap(() =>
      this.userService.getAllUsers().pipe(
        map((result) => UserActions.getAllUsersSuccess({ users: result.users })),
        catchError((error) => of(UserActions.getAllUsersFailure({ error })))
      )
    )
  ));

  disconnectUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.disconnectUser),
    tap(() => {
      this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'Disconnected successfully!'});
      this.router.navigate(['auth/login']);
    })
  ), { dispatch: false });

  addUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.addUser),
    mergeMap((action) =>
      this.userService.addUser(action.user).pipe(
        map((addUserRes) => {
          this.modalService.dismissAll();
          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The user has been added successfully'});

          return UserActions.getAllUsers()
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.error : error.statusText});
          return of(UserActions.addUserFailure({ error }));
        })
      )
    )
  ));

  sendForgotPassword$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.sendForgotPassword),
    mergeMap((action) =>
      this.userService.sendForgotPassword(action.email).pipe(
        map((result) => {
          this.router.navigate(['auth/login']);
          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'Check your email to reset your password!'});
          return UserActions.sendForgotPasswordSuccess({ message: result.message })
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.error : error.statusText});
          return of(UserActions.sendForgotPasswordFailure({ error }));
        })
      )
    )
  ));

  resetPassword$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.resetPassword),
    mergeMap((action) =>
      this.userService.resetPassword(action.token, action.password).pipe(
        map((result) => {
          this.router.navigate(['auth/login']);
          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The password has been changed successfully!'});
          return UserActions.resetPasswordSuccess({ message: result.message })
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.error : error.statusText});
          return of(UserActions.resetPasswordFailure({ error }))
        })
      )
    )
  ));

  editUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.updateUser),
    mergeMap((action) =>
      this.userService.updateUser(action.user).pipe(
        map((result) => {
          this.modalService.dismissAll();
          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The user has been updated successfully!'});
          
          return UserActions.getAllUsers();
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.error : error.statusText});
          return of(UserActions.updateUserFailure({ error }))
        })
      )
    )
  ));

  deleteUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.deleteUser),
    mergeMap((action) =>
      this.userService.deleteUser(action.userId).pipe(
        map((result) => {
          this.modalService.dismissAll();
          this.messageService.add({severity:'success', summary:'Operation Succeed', detail: 'The user has been deleted successfully!'});

          return UserActions.getAllUsers()
        }),
        catchError((error) => {
          this.messageService.add({severity:'error', summary:'Operation Failed', detail: error.error.error ? error.error.error : error.statusText});
          return of(UserActions.deleteUserFailure({ error }))
        })
      )
    )
  ));
}