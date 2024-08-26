import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthLayoutRoutes } from './auth-layout.routing';

import { ToastModule } from 'primeng/toast';
import { ForgotPasswordComponent } from 'src/app/pages/auth/forgot-password/forgot-password.component';
import { LoginComponent } from '../../pages/auth/login/login.component';
import { UnauthorizedComponent } from 'src/app/pages/all/unauthorized/unauthorized.component';
import { ResetPasswordComponent } from 'src/app/pages/auth/reset-password/reset-password.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    ToastModule
    // NgbModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UnauthorizedComponent,
  ]
})
export class AuthLayoutModule { }
