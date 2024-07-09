import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthAdminGuard } from './configs/guards/auth-admin.guard';
import { AuthEmployeeGuard } from './configs/guards/auth-employee.guard';

const routes: Routes =[
    // { path: 'home',             component: HomeComponent },
    // { path: 'user-profile',     component: ProfileComponent },
    // { path: 'register',         component: SignupComponent },
    // { path: 'landing',          component: LandingComponent },
    // { path: 'login',            component: LoginComponent },
    // { path: 'forgot-password',  component: ForgotPasswordComponent },
    // { path: 'reset-password',   component: ResetPasswordComponent },
    // { path: '',                 redirectTo: 'login', pathMatch: 'full' }
    { path: 'landing',          component: LandingComponent },
    {
      path: 'admin',
      component: AdminLayoutComponent,
      canActivate: [AuthAdminGuard], 
      children: [
        { path: 'dashboard', component: DashboardComponent },
      ],
    },
    {
      path: 'employee',
      component: EmployeeLayoutComponent,
      canActivate: [AuthEmployeeGuard], 
      children: [
        { path: 'profile', component: ProfileComponent },
        { path: 'home',    component: HomeComponent }
      ],
    },
    {
      path: 'auth',
      component: AuthLayoutComponent,
      children: [
        { path: 'login',            component: LoginComponent },
        { path: 'forgot-password',  component: ForgotPasswordComponent },
        { path: 'reset-password',   component: ResetPasswordComponent },
        { path: '', redirectTo: "login", pathMatch: "full" },
        // other auth routes
      ],
    },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
