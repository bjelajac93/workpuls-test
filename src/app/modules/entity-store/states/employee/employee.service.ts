import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Employee } from 'src/app/modules/shared/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends EntityCollectionServiceBase<Employee> {
  constructor(elementsFactory: EntityCollectionServiceElementsFactory) {
    super('Employee', elementsFactory);
  }
}
