import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserRole } from '../store/user/user.selector';
import { Observable, tap } from 'rxjs';
import { Role } from '../models/enums/Role.enum';
import { Router } from '@angular/router';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {

  userRole$: Observable<string>;
  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
    this.userRole$ = this.store.select(selectUserRole);
  }

  routeToHomePage(){
    this.userRole$.subscribe((role) => {
      if(role === Role.ADMIN){
        this.router.navigate(['/admin/dashboard']);
      } else if(role === Role.EMPLOYEE){
        this.router.navigate(['/employee/home']);
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
