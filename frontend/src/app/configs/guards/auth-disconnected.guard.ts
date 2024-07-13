import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { isUserConnected } from 'src/app/store/user/user.selector';

@Injectable({
  providedIn: 'root'
})
export class AuthDisconnectedGuard implements CanActivate {

  constructor(private store: Store<AppState>, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.store.select(isUserConnected).pipe(map((isConnected) => {
        if(!isConnected){
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }));
  }
  
}
