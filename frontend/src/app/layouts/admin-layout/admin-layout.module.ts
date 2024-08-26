import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ClipboardModule } from 'ngx-clipboard';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { UsersManagementComponent } from 'src/app/pages/admin/users-management/users-management.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { AdminLeavesComponent } from 'src/app/pages/admin/admin-leaves/admin-leaves.component';
import { EmployeeLeavesComponent } from 'src/app/pages/all/employee-leaves/employee-leaves.component';
import { AdminCheckInsComponent } from 'src/app/pages/admin/admin-check-ins/admin-check-ins.component';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    TableModule,
		ButtonModule,
    InputTextModule,
    ToolbarModule,
    RippleModule,
    CalendarModule,
    FileUploadModule,
    ToastModule,
  ],
  declarations: [
    DashboardComponent,
    UsersManagementComponent,
    AdminLeavesComponent,
    AdminCheckInsComponent
  ]
})

export class AdminLayoutModule {}
