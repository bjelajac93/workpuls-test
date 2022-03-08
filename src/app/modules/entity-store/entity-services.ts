import { Injectable } from '@angular/core';
import { EntityServicesBase, EntityServicesElements } from '@ngrx/data';
import { Employee } from '../shared/models/employee.model';
import { Shift } from '../shared/models/shift.model';
import { EmployeeService } from './states/employee/employee.service';
import { ShiftService } from './states/shift/shift.service';

@Injectable()
export class AppEntityServices extends EntityServicesBase {
  constructor(
    elements: EntityServicesElements,
    readonly employeeService: EmployeeService,
    readonly shiftService: ShiftService,
  ) {
    super(elements);
    this.registerEntityCollectionServices([
        employeeService,
        shiftService
    ]);
  }

  get EmployeeService() {
    return this.getEntityCollectionService<Employee>('Employee');
  }

  get ShiftService() {
    return this.getEntityCollectionService<Shift>('Shift');
  }
}
