import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _snackBar: MatSnackBar) {}

  public success(message: string, title: string) {
    this._snackBar.open(message, title, {
      duration: 2000,
      panelClass: 'success-snack-bar'
    });
  }

  public error(message: string, title: string) {
    this._snackBar.open(message, title, {
      panelClass: 'error-snack-bar'
    });
  }

  public warning(message: string, title: string) {
    this._snackBar.open(message, title, {
      panelClass: 'warning-snack-bar'
    });
  }
}
