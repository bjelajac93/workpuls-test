import { Injectable } from '@angular/core';
import { ChangeSetItem, ChangeSetOperation, EntityServicesBase, EntityServicesElements, changeSetItemFactory as cif, EntityCacheDispatcher, ChangeSetUpdate, ChangeSet, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { map } from 'rxjs/operators';
import { Employee } from '../shared/models/employee.model';
import { Shift } from '../shared/models/shift.model';
import { EmployeeService } from './states/employee/employee.service';
import { ShiftService } from './states/shift/shift.service';
export interface ChangeSetUpsert<T = any> {
  op: ChangeSetOperation.Upsert;
  entityName: string;
  entities: T[];
}
@Injectable()
export class AppEntityServices extends EntityServicesBase {
  constructor(
    elements: EntityServicesElements,
    readonly employeeService: EmployeeService,
    readonly shiftService: ShiftService,
    readonly entityCacheDispatcher: EntityCacheDispatcher
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

  // NOTE: if backend suuport multiple upsert
   
  // upsertEmployees(employees: Employee[]) {

  //   const changes: ChangeSetItem[] = [
  //     {
  //       op: ChangeSetOperation.Upsert,
  //       entityName: 'Employee',
  //       entities: employees
  //     }
  //   ];

  //   return this.entityCacheDispatcher.saveEntities(changes, `/api/employees`).pipe(
  //     map(response => response)
  //   );
  // }
}
