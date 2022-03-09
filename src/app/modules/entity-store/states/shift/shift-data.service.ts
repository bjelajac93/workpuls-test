import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator, Logger } from '@ngrx/data';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Shift } from 'src/app/modules/shared/models/shift.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ShiftDataService extends DefaultDataService<Shift> {
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    logger: Logger
  ) {
    super('Shift', http, httpUrlGenerator);
    logger.log('Created custom Shift EntityDataService');
  }

  // Overrided Methods
  getAll(): Observable<Shift[]> {
    return this.http.get<Shift[]>('/api/shifts').pipe(delay(2000));;
  }

  upsert(shift: Shift): Observable<any> {
    if (shift.id) {
      return this.http.put<Shift>(`/api/shifts/${shift.id}`, shift);
    } else {
      return this.http.post<Shift>('/api/shifts', shift);
    }
  }
}
