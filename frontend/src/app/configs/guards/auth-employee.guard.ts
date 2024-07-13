import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Role } from 'src/app/models/enums/Role.enum';
import { AppState } from 'src/app/store/app.state';
import { selectUserRole } from 'src/app/store/user/user.selector';

@Injectable({
  providedIn: 'root'
})
export class AuthEmployeeGuard implements CanActivate {

  constructor(private store: Store<AppState>, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.store.select(selectUserRole).pipe(map((role) => {
        if(role === Role.EMPLOYEE){
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false
        }
      }))
  }
  
}
