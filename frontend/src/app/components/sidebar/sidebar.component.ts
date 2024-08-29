import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AppState } from 'src/app/store/app.state';
import { disconnectUser } from 'src/app/store/user/user.actions';
import { selectCurrentUser, selectUserRole } from 'src/app/store/user/user.selector';
import { getUserFullName } from 'src/app/utils/utils';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ADMIN_ROUTES: RouteInfo[] = [
  { path: '/admin/dashboard', title: 'Dashboard',  icon: 'pi pi-desktop', class: '' },
  { path: '/admin/users', title: 'Users Management',  icon: 'pi pi-users', class: '' },
  { path: '/admin/all-leaves', title: 'All Leaves',  icon: 'pi pi-calendar', class: '' },
  { path: '/admin/leaves', title: 'Leaves Requests',  icon: 'pi pi-calendar-plus', class: '' },
  { path: '/admin/pointings', title: 'Pointings',  icon: 'pi pi-clock', class: '' },
  { path: '/admin/my-loans', title: 'My Loans Requests',  icon: 'pi pi-money-bill', class: '' },
  { path: '/admin/all-loans', title: 'All Loans Requests',  icon: 'pi pi-money-bill', class: '' },
];

export const EMPLOYEE_ROUTES: RouteInfo[] = [
  { path: '/employee/home', title: 'Home',  icon: 'pi pi-home', class: '' },
  { path: '/employee/leaves', title: 'Leaves Requests',  icon: 'pi pi-calendar-plus', class: '' },
  { path: '/employee/pointings', title: 'My Pointings',  icon: 'pi pi-clock', class: '' },
  { path: '/employee/my-loans', title: 'My Loans Requests',  icon: 'pi pi-money-bill', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  userRole$ : Observable<string>;
  currentUser$: Observable<User>;


  constructor(private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    this.userRole$ = this.store.select(selectUserRole);
    this.currentUser$ = this.store.select(selectCurrentUser);

    this.userRole$.subscribe(role => {
      if (role === 'Admin') {
        this.menuItems = ADMIN_ROUTES.filter(menuItem => menuItem);
      } else if( role === 'Employee') {
        this.menuItems = EMPLOYEE_ROUTES.filter(menuItem => menuItem);
      }
    });
    
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  logout(){
    this.store.dispatch(disconnectUser());
  }

  getUserFullName = getUserFullName
}
