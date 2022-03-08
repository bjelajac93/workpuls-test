import { SelectionModel } from '@angular/cdk/collections';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BulkEditComponent } from '../core/components/bulk-edit/bulk-edit.component';
import { Employee } from '../shared/models/employee.model';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AppEntityServices } from '../entity-store/entity-services';
import { Shift } from '../shared/models/shift.model';
import { minutesToHours } from 'src/assets/utils/calculator';
import { environment } from 'src/environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  mobileQuery: MediaQueryList;
  dataSource = new TableVirtualScrollDataSource<Employee>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'clock-in',
    'total-amount',
    'clock-out',
    'total-overtime-amount',
  ];
  private _mobileQueryListener: () => void;
  selection = new SelectionModel<Employee>(true, []);

  public loadingEmployees$: Observable<boolean>;
  public loadingShifts$: Observable<boolean>;

  employees: Employee[] = [];
  shifts: Shift[] = [];
  numberOfEmployees: number = 0;
  totalClockedIn: number = 0;
  totalClockedOut: number = 0;
  totalHourlyAmmount: number = 0;
  totalOvertimeHourlyAmmount: number = 0;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog,
    private apppEntityServices: AppEntityServices,
    private cdRef: ChangeDetectorRef
  ) {
    this.loadingEmployees$ = this.apppEntityServices.EmployeeService.loading$;
    this.loadingShifts$ = this.apppEntityServices.ShiftService.loading$;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    combineLatest([
      this.apppEntityServices.EmployeeService.entities$,
      this.apppEntityServices.ShiftService.entities$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        map((d) => {
          return {
            employees: d[0],
            shifts: d[1],
          };
        })
      )
      .subscribe({
        next: (response) => {
          this.employees = response.employees;
          this.shifts = response.shifts;

          if (this.shifts.length && this.employees.length) {
            this.calculateTotals();
          }

          this.dataSource = new TableVirtualScrollDataSource<Employee>(this.employees);
          this.dataSource.paginator = this.paginator;
        },
        complete: () => {},
        error: (err) => {
          alert('error');
        },
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Employee): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }

  openDialog() {
    const dialogRef = this.dialog.open(BulkEditComponent, {
      data: this.selection.selected.map(a => a.id),
      panelClass: 'dialog-responsive',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  calculateTotals() {
    this.numberOfEmployees = this.employees.length;
    this.totalClockedIn = 0;
    this.totalClockedOut = 0;
    this.totalHourlyAmmount = 0;
    this.totalOvertimeHourlyAmmount = 0;

    for (const shift of this.shifts) {
      let clockIn = new Date(shift.clockIn);
      let clockOut = new Date(shift.clockOut);
      let hours = clockOut.getHours() - clockIn.getHours();
      let minutes = clockOut.getMinutes() - clockIn.getMinutes();

      let totalHours = hours + minutesToHours(minutes);

      if (totalHours <= environment.dailyShift) {
        this.totalClockedIn += totalHours;
        this.totalHourlyAmmount += totalHours * (this.employees.find(e => e.id === shift.employeeId)?.hourlyRate ?? 0);
      } else {
        this.totalClockedIn += environment.dailyShift;
        this.totalClockedOut += totalHours - environment.dailyShift;
        this.totalHourlyAmmount += environment.dailyShift * (this.employees.find(e => e.id === shift.employeeId)?.hourlyRate ?? 0);
        this.totalOvertimeHourlyAmmount += (totalHours - environment.dailyShift) * (this.employees.find(e => e.id === shift.employeeId)?.overtimeHourlyRate ?? 0);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
