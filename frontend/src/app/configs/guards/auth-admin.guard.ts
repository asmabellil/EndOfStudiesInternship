import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Role } from 'src/app/models/enums/Role.enum';
import { AppState } from 'src/app/store/app.state';
import { selectUserRole } from 'src/app/store/user/user.selector';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {

  constructor(private store: Store<AppState>
) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.store.select(selectUserRole).pipe(map((role) => role === Role.ADMIN))
  }
}
