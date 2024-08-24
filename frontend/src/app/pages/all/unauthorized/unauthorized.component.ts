import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/enums/Role.enum';
import { AppState } from 'src/app/store/app.state';
import { selectUserRole } from 'src/app/store/user/user.selector';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
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
