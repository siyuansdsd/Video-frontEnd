import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
      panelClass: 'snackbar-success',
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
      panelClass: 'snackbar-error',
    });
  }
}
