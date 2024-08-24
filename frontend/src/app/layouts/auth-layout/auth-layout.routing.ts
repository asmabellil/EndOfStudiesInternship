import { Routes } from '@angular/router';

import { ForgotPasswordComponent } from 'src/app/pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'src/app/pages/auth/reset-password/reset-password.component';
import { LoginComponent } from '../../pages/auth/login/login.component';
import { UnauthorizedComponent } from 'src/app/pages/all/unauthorized/unauthorized.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',                  component: LoginComponent },
    { path: 'forgot-password',        component: ForgotPasswordComponent },
    { path: 'reset-password/:token',  component: ResetPasswordComponent },
    { path: 'unauthorized',           component: UnauthorizedComponent },
    { path: '', redirectTo: "login", pathMatch: "full" },
];
