/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RegisterComponent } from '../register.component';
import { AlertService } from '../../../services/alert/alert.service';
import { AuthService } from '../../../services/auth/auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    mockAlertService = jasmine.createSpyObj('AlertService', [
      'showSuccess',
      'showError',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        RegisterComponent,
      ],
      providers: [
        { provide: AlertService, useValue: mockAlertService },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'mock-token',
              },
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.register on form submit if form is valid', () => {
    const email = 'test@example.com';
    const name = 'Test User';
    const password = 'password123';
    component.registerForm.setValue({ email, name, password });

    mockAuthService.register.and.returnValue({
      // eslint-disable-next-line @typescript-eslint/ban-types
      subscribe: (callbacks: { next: Function; error: Function }) => {
        callbacks.next('Registration successful');
      },
    } as any);

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith(
      name,
      email,
      password
    );
    setTimeout(() => {
      expect(mockAlertService.showSuccess).toHaveBeenCalledWith(
        'Registration successful'
      );
    }, 200);
  });

  it('should show error if form is invalid on submit', () => {
    component.registerForm.setValue({ email: '', name: '', password: '' });
    component.onSubmit();

    setTimeout(() => {
      expect(mockAlertService.showError).toHaveBeenCalledWith(
        'Registration failed'
      );
    }, 200);
  });

  it('should handle registration error', () => {
    const email = 'test@example.com';
    const name = 'Test User';
    const password = 'password123';
    component.registerForm.setValue({ email, name, password });

    mockAuthService.register.and.returnValue({
      // eslint-disable-next-line @typescript-eslint/ban-types
      subscribe: (callbacks: { next: Function; error: Function }) => {
        callbacks.error({ error: { message: 'Registration failed' } });
      },
    } as any);

    component.onSubmit();

    setTimeout(() => {
      expect(mockAlertService.showError).toHaveBeenCalledWith(
        'Registration failed'
      );
    }, 200);
  });
});
