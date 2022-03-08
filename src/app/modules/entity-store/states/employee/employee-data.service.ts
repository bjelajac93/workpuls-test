import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator, Logger } from '@ngrx/data';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/modules/shared/models/employee.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class EmployeeDataService extends DefaultDataService<Employee> {
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    logger: Logger
  ) {
    super('Employee', http, httpUrlGenerator);
    logger.log('Created custom Employee EntityDataService');
  }

  // Overrided Methods
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>('/api/employees');
  }

  upsert(employee: Employee): Observable<any> {
    if (employee.id) {
      return this.http.put<Employee>(`/api/employees/${employee.id}`, employee);
    } else {
      return this.http.post<Employee>('/api/employees', employee);
    }
  }
}
