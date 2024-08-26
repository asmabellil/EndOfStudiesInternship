import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { AppState } from 'src/app/store/app.state';
import { connectUser, connectUserWithGoogle } from 'src/app/store/user/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
}
