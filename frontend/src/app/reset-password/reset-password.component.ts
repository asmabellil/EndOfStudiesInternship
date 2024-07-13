import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { resetPassword } from '../store/user/user.actions';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  focus: boolean;
  focus1: boolean;
  resetPasswordToken: string;

  constructor(private activatedRoute: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    this.resetPasswordToken = this.activatedRoute.snapshot.paramMap.get('token');
  }

  get password(){
    return this.resetPasswordForm.get('password').value;
  
  }

  passwordsAreEqual() {
    return this.resetPasswordForm.get('password').value === this.resetPasswordForm.get('confirmPassword').value;
  }

  resetPassword() {
    this.store.dispatch(resetPassword({ password: this.password, token: this.resetPasswordToken }));
  }

}
