import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { sendForgotPassword } from '../store/user/user.actions';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  focus: boolean;
  focus1: boolean;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  forgotPassword() {
    this.store.dispatch(sendForgotPassword({ email: this.forgotPasswordForm.value.email }));
  }
}
