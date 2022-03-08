import { NgModule } from '@angular/core';
import {
  EntityDataService,
  EntityServices
} from '@ngrx/data';
import { AppEntityServices } from './entity-services';
import { EmployeeDataService } from './states/employee/employee-data.service';
import { EmployeeResolver } from './states/employee/employee.resolver';
import { ShiftDataService } from './states/shift/shift-data.service';
import { ShiftResolver } from './states/shift/shift.resolver';

@NgModule({
  imports: [],
  providers: [
    AppEntityServices,
    EmployeeDataService,
    ShiftDataService,
    EmployeeResolver,
    ShiftResolver,
    { provide: EntityServices, useExisting: AppEntityServices },
  ],
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService,
    employeeDataService: EmployeeDataService,
    shiftDataService: ShiftDataService
  ) {
    entityDataService.registerService('Employee', employeeDataService);
    entityDataService.registerService('Shift', shiftDataService);
  }
}
