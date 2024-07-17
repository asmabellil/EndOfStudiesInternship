import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Store } from '@ngrx/store';
import { connectUser, connectUserWithGoogle } from '../store/user/user.actions';
import { AppState } from '../store/app.state';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  focus: boolean;
  focus1: boolean;
  constructor(private router: Router, private userService: UserService, private store: Store<AppState>) {
    this.handleCredentialResponse = this.handleCredentialResponse.bind(this)
   }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    (window as any).handleCredentialResponse = this.handleCredentialResponse;
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

  handleCredentialResponse(response): void {
    const googleCredentials = jwtDecode<any>(response.credential);
    this.store.dispatch(connectUserWithGoogle({email: googleCredentials.email}));
  }

  // // Function to handle sign out (optional)
  // handleSignout(): void {
  //   (window as any).google.accounts.id.disableAutoSelect();
  // }
}
