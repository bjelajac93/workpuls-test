import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import { AppEntityServices } from '../../entity-services';

@Injectable()
export class EmployeeResolver implements Resolve<boolean>, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private apppEntityServices: AppEntityServices) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.apppEntityServices.EmployeeService.loaded$.pipe(
      takeUntil(this.destroy$),
      tap((loaded) => {
        if (!loaded) {
          return this.apppEntityServices.EmployeeService.getAll();
        } else {
          return !!loaded;
        }
      }),
      first()
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
