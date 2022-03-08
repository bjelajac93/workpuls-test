import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeResolver } from '../entity-store/states/employee/employee.resolver';
import { ShiftResolver } from '../entity-store/states/shift/shift.resolver';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      employees: EmployeeResolver,
      shifts: ShiftResolver
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
