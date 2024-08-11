import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RequestsInterceptor } from './configs/interceptors/requests.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeModule } from './home/home.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { rootReducer } from './store/root.reducer';
import { UserEffects } from './store/user/user.effects';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

// primeNg imports
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { EmployeeLeavesComponent } from './employee-leaves/employee-leaves.component';
import { AdminLeavesComponent } from './admin-leaves/admin-leaves.component';
import { LeavesEffects } from './store/leaves/leaves.effects';
import { CalendarModule } from 'primeng/calendar';
import { AdminCheckInsComponent } from './admin-check-ins/admin-check-ins.component';
import { CheckInsEffects } from './store/checkIn/check-in.effects';
import {FileUploadModule} from 'primeng/fileupload';



@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    FooterComponent,
    NavbarComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminLayoutComponent,
    EmployeeLayoutComponent,
    AuthLayoutComponent,
    DashboardComponent,
    UnauthorizedComponent,
    EmployeeLeavesComponent,
    AdminLeavesComponent,
    AdminCheckInsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot(rootReducer),
    EffectsModule.forRoot([UserEffects, LeavesEffects, CheckInsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 30 }),
    TableModule,
		ButtonModule,
    InputTextModule,
    ToolbarModule,
    RippleModule,
    ToastModule,
    BrowserAnimationsModule,
    CalendarModule,
    FileUploadModule
  ],
  providers: [
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestsInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
