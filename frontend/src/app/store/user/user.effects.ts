import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { catchError, combineLatest, filter, map, mergeMap, of, take, tap, withLatestFrom } from "rxjs";
import { UserService } from "src/app/services/user.service";
import * as UserActions from './user.actions';
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { isUserConnected } from "./user.selector";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router,
    private store: Store,
    private modalService: NgbModal
  ) {}

  connectUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.connectUser),
    mergeMap((action) =>
      this.userService.connect(action.email, action.password).pipe(
        take(1),
        mergeMap((connectResult) =>
          {
            const decodedToken = jwtDecode<JwtPayload>(connectResult.token);
            return this.userService.getUser(decodedToken['userId']).pipe(
              take(1),
              map((getUserRes) => {
                decodedToken['role'] === 'Admin' ? this.router.navigate(['admin/dashboard']) : this.router.navigate(['employee/home']);
                return UserActions.connectUserSuccess({ token: connectResult.token, decodedToken: decodedToken, user: getUserRes.user });
              }),
              catchError((error) => of(UserActions.connectUserFailure({ error })))
            )
          }
        )
      )
    )
  ));

  getAllUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.connectUserSuccess),
    withLatestFrom(this.store.select(isUserConnected)),
    filter(([action, isUserConnected]) => action.decodedToken['role'] === 'Admin' && isUserConnected),
    take(1),
    mergeMap(() =>
      this.userService.getAllUsers().pipe(
        map((result) => UserActions.getAllUsersSuccess({ users: result.users })),
        catchError((error) => of(UserActions.getAllUsersFailure({ error })))
      )
    )
  ));

  disconnectUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.disconnectUser),
    tap(() => this.router.navigate(['auth/login']))
  ), { dispatch: false });

  addUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.addUser),
    mergeMap((action) =>
      this.userService.addUser(action.user).pipe(
        map((addUserRes) => {
          this.modalService.dismissAll();
          return UserActions.addUserSuccess({ user: addUserRes.user })
        }),
        catchError((error) => of(UserActions.addUserFailure({ error })))
      )
    )
  ));
  
}