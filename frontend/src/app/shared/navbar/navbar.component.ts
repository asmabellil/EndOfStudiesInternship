import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Store } from '@ngrx/store';
import { isUserConnected, selectUserFullName, selectUserRole } from 'src/app/store/user/user.selector';
import { Observable, tap } from 'rxjs';
import { disconnectUser } from 'src/app/store/user/user.actions';
import { AppState } from 'src/app/store/app.state';
import { Role } from 'src/app/models/enums/Role.enum';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public isCollapsed = true;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    isUserConnected$: Observable<boolean>;
    userFullName$: Observable<string>;
    userRole$: Observable<Role>;

    constructor(public location: Location, private router: Router, private userService: UserService, private store: Store<AppState>
) {
    }

    ngOnInit() {
      this.router.events.subscribe((event) => {
        this.isCollapsed = true;
        if (event instanceof NavigationStart) {
           if (event.url != this.lastPoppedUrl)
               this.yScrollStack.push(window.scrollY);
       } else if (event instanceof NavigationEnd) {
           if (event.url == this.lastPoppedUrl) {
               this.lastPoppedUrl = undefined;
               window.scrollTo(0, this.yScrollStack.pop());
           } else
               window.scrollTo(0, 0);
       }
     });
     this.location.subscribe((ev:PopStateEvent) => {
         this.lastPoppedUrl = ev.url;
     });

     this.isUserConnected$ = this.store.select(isUserConnected);
     this.userFullName$ = this.store.select(selectUserFullName);
     this.userRole$ = this.store.select(selectUserRole);
    }

    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '#/home' ) {
            return true;
        }
        else {
            return false;
        }
    }
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '#/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }

    logOut() {
        this.store.dispatch(disconnectUser());
    }

    routeTo(path: string) {
        this.router.navigate([path]);
    }
}
