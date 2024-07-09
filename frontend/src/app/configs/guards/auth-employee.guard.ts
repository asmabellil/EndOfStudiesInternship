import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Role } from 'src/app/models/enums/Role.enum';
import { selectUserRole } from 'src/app/store/user/user.selector';

@Injectable({
  providedIn: 'root'
})
export class AuthEmployeeGuard implements CanActivate {

  constructor(private store: Store) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.store.select(selectUserRole).pipe(
        map((role) => {
          return role === Role.EMPLOYEE;
        })
      )
  }
  
}
