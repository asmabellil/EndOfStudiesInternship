import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { catchError, filter, map, mergeMap, of, take, tap } from "rxjs";
import { UserService } from "src/app/services/user.service";
import * as UserActions from './user.actions';
import { Router } from "@angular/router";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router
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
  ), { dispatch: true });

  getAllUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.connectUserSuccess),
    filter((action) => action.decodedToken['role'] === 'Admin'),
    mergeMap(() =>
      this.userService.getAllUsers().pipe(
        map((result) => UserActions.getAllUsersSuccess({ users: result.users })),
        catchError((error) => of(UserActions.getAllUsersFailure({ error })))
      )
    )
  ), { dispatch: true });

  disconnectUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.disconnectUser),
    tap(() => this.router.navigate(['auth/login']))
  ), { dispatch: false });
  
}