import { Routes } from '@angular/router';
import { AdminCheckInsComponent } from 'src/app/pages/admin/admin-check-ins/admin-check-ins.component';
import { EmployeeLeavesComponent } from 'src/app/pages/all/employee-leaves/employee-leaves.component';
import { HomeComponent } from 'src/app/pages/employee/home/home.component';



export const EmployeeLayoutRoutes: Routes = [
    { path: 'leaves', component: EmployeeLeavesComponent},
    { path: 'pointings', component: AdminCheckInsComponent},
    { path: 'home', component: HomeComponent}
];
