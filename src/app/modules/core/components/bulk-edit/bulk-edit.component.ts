import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from 'src/app/modules/shared/models/employee.model';
import { Shift } from 'src/app/modules/shared/models/shift.model';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { AppEntityServices } from 'src/app/modules/entity-store/entity-services';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { FormValidatorService } from 'src/app/modules/shared/services/form-validator.service';

const clockInDate = new Date();
clockInDate.setHours(8);
clockInDate.setMinutes(0);

const clockOutDate = new Date();
clockOutDate.setHours(17);
clockOutDate.setMinutes(0);

const clockOutDate2 = new Date();
clockOutDate2.setHours(18);
clockOutDate2.setMinutes(0);

@Component({
  selector: 'app-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkEditComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  bulkEditForm: FormGroup;
  floatLabelControl = new FormControl('auto');

  displayedColumns: string[] = ['id', 'clock-in', 'clock-out', 'total'];
  dataSources: TableVirtualScrollDataSource<Shift>[] = [];

  public loadingEmployees$: Observable<boolean>;
  public loadingShifts$: Observable<boolean>;

  selectedEmployeeIds: number[] = [];
  employeeItems: Employee[] = [];

  shifts: Shift[] = [];

  rate: number = 30;

  get employees() {
    return <FormArray>this.bulkEditForm.get('employees');
  }

  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: number[],
    private decimalPipe: DecimalPipe,
    private notificationService: NotificationService,
    private apppEntityServices: AppEntityServices,
    private formValidatorService: FormValidatorService,
    private dialogRef: MatDialogRef<BulkEditComponent>
  ) {
    this.loadingEmployees$ = this.apppEntityServices.EmployeeService.loading$;
    this.loadingShifts$ = this.apppEntityServices.ShiftService.loading$;

    this.bulkEditForm = this.fb.group({
      employees: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.selectedEmployeeIds = this.data;

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
          this.employeeItems = response.employees;
          this.shifts = response.shifts;
          this.reloadData();
        },
        complete: () => {},
        error: (err) => {
          alert('error');
        },
      });
  }

  reloadData() {
    this.dataSources = [];
    this.employees.controls = [];
    if (this.shifts.length && this.employeeItems.length) {
      for (let i = 0; i < this.employeeItems.length; i++) {
        if (this.selectedEmployeeIds.includes(this.employeeItems[i].id)) {
          let dataSource = new TableVirtualScrollDataSource<Shift>(
            this.shifts.filter(
              (a) => a.employeeId === this.employeeItems[i].id
            )
          );
          this.dataSources.push(dataSource);
          this.addEmployeeControl(i);
        }
      }
    } else {
      this.employees.controls = [];
    }
  }

  addEmployeeControl(index: number) {
    this.employees.push(
      this.fb.group({
        id: [this.employeeItems[index].id, Validators.required],
        name: [this.employeeItems[index].name, Validators.required],
        email: [this.employeeItems[index].email, Validators.required],
        hourlyRate: [
          this.decimalPipe.transform(
            this.employeeItems[index].hourlyRate,
            '1.2-2'
          ),
          Validators.required,
        ],
        overtimeHourlyRate: [
          this.decimalPipe.transform(
            this.employeeItems[index].overtimeHourlyRate,
            '1.2-2'
          ),
          Validators.required,
        ],
        shifts: this.createShiftControl(index),
      })
    );
  }

  createShiftControl(index: number): FormArray {
    let shiftArray: FormArray = this.fb.array([]);
    for (const shift of this.shifts.filter(
      (a) => a.employeeId === this.employeeItems[index].id
    )) {
      let clockIn = new Date(shift.clockIn);
      let clockOut = new Date(shift.clockOut);
      let hours = clockOut.getHours() - clockIn.getHours();
      let minutes = clockOut.getMinutes() - clockIn.getMinutes();

      let test = new Date(clockIn);
      test.setHours(hours);
      test.setMinutes(minutes);
      test.setSeconds(0);
      test.setMilliseconds(0);

      shiftArray.push(
        this.fb.group({
          id: [shift.id, Validators.required],
          employeeId: [shift.employeeId, Validators.required],
          clockIn: [clockIn, Validators.required],
          clockOut: [clockOut, Validators.required],
          total: [{ value: test, disabled: true }, Validators.required],
        })
      );
    }
    return shiftArray;
  }

  onSubmit(): any {
    if (!this.formValidatorService.markInvalid(this.bulkEditForm)) {
      return false;
    }

    let agreementForm = this.bulkEditForm.value;

    const calls: any = [];

    agreementForm.employees.forEach((employee: any) => {
      let upsertEmployee = { ...employee };
      upsertEmployee.hourlyRate = Number(upsertEmployee.hourlyRate);
      upsertEmployee.overtimeHourlyRate = Number(
        upsertEmployee.overtimeHourlyRate
      );
      let upsertShifts = [...upsertEmployee.shifts] as Shift[];
      delete upsertEmployee.shifts;
      for (const shift of upsertShifts) {
        calls.push(this.apppEntityServices.ShiftService.upsert(shift));
      }
      calls.push(this.apppEntityServices.EmployeeService.upsert(upsertEmployee));
    });

    forkJoin(calls).subscribe(
      () => {
        this.notificationService.success(
          'Entires have been successfully updated.',
          'SUCCESS!'
        );
        this.dialogRef.close();
      },
      (error) => {
        this.notificationService.success(
          'Entires have not been updated.',
          'ERROR!'
        );
      }
    );
  }

  timeChangeHandler(data: any) {
    console.log('time changed to', data);
  }

  invalidInputHandler() {
    console.log('invalid input');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
