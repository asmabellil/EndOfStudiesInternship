import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UsersManagementComponent } from 'src/app/pages/admin/users-management/users-management.component';
import { AdminLeavesComponent } from 'src/app/pages/admin/admin-leaves/admin-leaves.component';
import { EmployeeLeavesComponent } from 'src/app/pages/all/employee-leaves/employee-leaves.component';
import { AdminCheckInsComponent } from 'src/app/pages/admin/admin-check-ins/admin-check-ins.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersManagementComponent },
    { path: 'all-leaves', component: AdminLeavesComponent},
    { path: 'leaves', component: EmployeeLeavesComponent},
    { path: 'pointings', component: AdminCheckInsComponent}
];
