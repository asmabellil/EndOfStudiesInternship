import { Routes } from '@angular/router';
import { AdminCheckInsComponent } from 'src/app/pages/admin/admin-check-ins/admin-check-ins.component';
import { EmployeeLeavesComponent } from 'src/app/pages/all/employee-leaves/employee-leaves.component';
import { HomeComponent } from 'src/app/pages/employee/home/home.component';
import { MyLoansComponent } from 'src/app/pages/employee/my-loans/my-loans.component';



export const EmployeeLayoutRoutes: Routes = [
    { path: 'leaves', component: EmployeeLeavesComponent},
    { path: 'pointings', component: AdminCheckInsComponent},
    { path: 'home', component: HomeComponent},
    { path: 'my-loans', component: MyLoansComponent},
];
