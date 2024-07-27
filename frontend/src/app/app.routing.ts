import { CommonModule, } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AuthAdminGuard } from './configs/guards/auth-admin.guard';
import { AuthDisconnectedGuard } from './configs/guards/auth-disconnected.guard';
import { AuthEmployeeGuard } from './configs/guards/auth-employee.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { EmployeeLeavesComponent } from './employee-leaves/employee-leaves.component';
import { AdminLeavesComponent } from './admin-leaves/admin-leaves.component';

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
        { path: 'all-leaves', component: AdminLeavesComponent},
        { path: 'leaves', component: EmployeeLeavesComponent}

      ],
    },
    {
      path: 'employee',
      component: EmployeeLayoutComponent,
      canActivate: [AuthEmployeeGuard], 
      children: [
        { path: 'profile', component: ProfileComponent },
        { path: 'home',    component: HomeComponent },
        { path: 'leaves', component: EmployeeLeavesComponent}
      ],
    },
    {
      path: 'auth',
      component: AuthLayoutComponent,
      canActivate: [AuthDisconnectedGuard],
      children: [
        { path: 'login',            component: LoginComponent },
        { path: 'forgot-password',  component: ForgotPasswordComponent },
        { path: 'reset-password/:token',   component: ResetPasswordComponent },
        { path: '', redirectTo: "login", pathMatch: "full" },
        // other auth routes
      ],
    },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
