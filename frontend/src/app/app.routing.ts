import { CommonModule, } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AuthDisconnectedGuard } from './configs/guards/auth-disconnected.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthAdminGuard } from './configs/guards/auth-admin.guard';
import { AuthEmployeeGuard } from './configs/guards/auth-employee.guard';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';

const routes: Routes =[
  { path: '', redirectTo: 'auth/login', pathMatch: 'full'}, 
  {
    path: 'admin',
    canActivate: [AuthAdminGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  }, {
    path: 'employee',
    canActivate: [AuthEmployeeGuard],
    component: EmployeeLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/employee-layout/employee-layout.module').then(m => m.EmployeeLayoutModule)
      }
    ]
  },{
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [AuthDisconnectedGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  }, 
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full'}
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
