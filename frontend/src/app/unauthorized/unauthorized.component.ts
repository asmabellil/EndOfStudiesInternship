import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserRole } from '../store/user/user.selector';
import { Observable, tap } from 'rxjs';
import { Role } from '../models/enums/Role.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {

  homePage$: Observable<string>;
  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {
    this.homePage$ = this.store.select(selectUserRole);
  }

  routeToHomePage(){
    this.homePage$.subscribe((role) => {
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
