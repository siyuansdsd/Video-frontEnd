import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoginComponent } from '../login.component';
import { AlertService } from '../../../services/alert/alert.service';
import * as AuthActions from '../../../store/actions/auth.action';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  const initialState = {
    auth: {
      login: null,
      error: null,
      user: null,
    },
  };

  beforeEach(waitForAsync(() => {
    mockAlertService = jasmine.createSpyObj('AlertService', [
      'showSuccess',
      'showError',
    ]);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        RouterTestingModule,
        LoginComponent,
        StoreModule.forRoot({}),
        BrowserAnimationsModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch login action on form submit with valid form', () => {
    const email = 'test@example.com';
    const password = 'password';
    component.loginForm.setValue({ email, password });

    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.login({ email, password })
    );
  });

  it('should show error if form is invalid on submit', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();

    expect(mockAlertService.showError).toHaveBeenCalledWith(
      'Invalid email or password'
    );
  });

  it('should show success message on successful login', () => {
    store.setState({
      auth: {
        login: true,
        error: null,
        user: null,
      },
    });

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockAlertService.showSuccess).toHaveBeenCalledWith(
      'Login successful'
    );
  });

  it('should show error message on login failure', () => {
    const errorMessage = 'Login failed';
    store.setState({
      auth: {
        login: null,
        error: { message: errorMessage },
        user: null,
      },
    });

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockAlertService.showError).toHaveBeenCalledWith(errorMessage);
  });
});
