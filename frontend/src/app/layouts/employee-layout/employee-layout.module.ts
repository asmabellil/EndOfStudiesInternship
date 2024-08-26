import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeLayoutRoutes } from './employee-layout.routing';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { HomeComponent } from 'src/app/pages/employee/home/home.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EmployeeLayoutRoutes),
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
  declarations: [HomeComponent]
})
export class EmployeeLayoutModule { }
