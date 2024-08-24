import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import {  selectCurrentUser, selectUserRole } from 'src/app/store/user/user.selector';
import { ADMIN_ROUTES, EMPLOYEE_ROUTES } from '../sidebar/sidebar.component';
import { User } from 'src/app/models/user.model';
import { getUserFullName } from 'src/app/utils/utils';
import { disconnectUser } from 'src/app/store/user/user.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;

  userRole$: Observable<string>;

  currentUser$: Observable<User>;

  constructor(location: Location,  private element: ElementRef, private router: Router, private store: Store<AppState>) {
    this.location = location;
  }

  ngOnInit() {
    this.userRole$ = this.store.select(selectUserRole);

    this.currentUser$ = this.store.select(selectCurrentUser);

    this.userRole$.subscribe(role => {
      if(role === 'Admin'){
        this.listTitles = ADMIN_ROUTES.filter(listTitle => listTitle);
      } else if(role === 'Employee'){
        this.listTitles = EMPLOYEE_ROUTES.filter(listTitle => listTitle);
      }
    });
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  logout(){
    this.store.dispatch(disconnectUser());
  }

  getUserFullName = getUserFullName

}
