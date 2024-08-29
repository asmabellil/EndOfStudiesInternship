import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { CheckInsEffects } from './store/checkIn/check-in.effects';
import { LeavesEffects } from './store/leaves/leaves.effects';
import { rootReducer } from './store/root.reducer';
import { UserEffects } from './store/user/user.effects';


// primeNg imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RequestsInterceptor } from './configs/interceptors/requests.interceptor';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';
import { EmployeeLeavesComponent } from './pages/all/employee-leaves/employee-leaves.component';
import { MyLoansComponent } from './pages/employee/my-loans/my-loans.component';
import { LoansEffects } from './store/loan/loan.effects';
import { AllLoansComponent } from './pages/admin/all-loans/all-loans.component';

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    StoreModule.forRoot(rootReducer),
    EffectsModule.forRoot([UserEffects, LeavesEffects, CheckInsEffects, LoansEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 30 }),
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    TableModule,
		ButtonModule,
    InputTextModule,
    ToolbarModule,
    RippleModule,
    CalendarModule,
    FileUploadModule,
    InputNumberModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    EmployeeLayoutComponent,
    EmployeeLeavesComponent,
    MyLoansComponent,
    AllLoansComponent
  ],
  providers: [
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestsInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
