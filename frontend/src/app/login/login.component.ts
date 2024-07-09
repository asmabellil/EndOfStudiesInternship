import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Store } from '@ngrx/store';
import { connectUser } from '../store/user/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  focus: boolean;
  focus1: boolean;
  constructor(private router: Router, private userService: UserService, private store: Store) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  get email() {
    return this.loginForm.get('email').value;
  }

  get password() {
    return this.loginForm.get('password').value;
  }

  connect() {
    this.store.dispatch(connectUser({email: this.email, password: this.password}));
  }

  routeTo(route: string) {
    this.router.navigate([route]);
  }

}
