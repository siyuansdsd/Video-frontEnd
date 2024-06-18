import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/actions/auth.action';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from '../../services/alert/alert.service';
import { RouterLink } from '@angular/router';
import {
  getLogin,
  getError,
  getUser,
} from '../../store/selectors/auth.selector';
import { OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule,
    RouterLink,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  login$ = this.store.select(getLogin);
  error$ = this.store.select(getError);
  user$ = this.store.select(getUser);
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.login$.subscribe((login) => {
      if (login) {
        console.log(login);
        this.alertService.showSuccess('Login successful');
      }
    });

    this.error$.subscribe((error) => {
      if (error) {
        this.alertService.showError(error.message);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ email, password }));
    } else {
      this.alertService.showError('Invalid email or password');
    }
  }
}
