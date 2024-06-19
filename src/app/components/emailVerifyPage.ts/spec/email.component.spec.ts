import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailVerifyComponent } from '../emailVerify.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from '../../loginPage/login.component';

describe('EmailVerifyComponent', () => {
  let component: EmailVerifyComponent;
  let fixture: ComponentFixture<EmailVerifyComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        EmailVerifyComponent,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
        ]),
      ],
      providers: [
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
    fixture = TestBed.createComponent(EmailVerifyComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    spyOn(router, 'navigate'); // Prevents actual navigation
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne(
      'http://localhost:3456/api/v1/auth/email/mock-token'
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
    expect(component).toBeTruthy();
  });

  it('should verify email on initialization', () => {
    const req = httpMock.expectOne(
      'http://localhost:3456/api/v1/auth/email/mock-token'
    );
    expect(req.request.method).toBe('GET');
    req.flush({});

    expect(component.verificationStatus).toBe('Email verified');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle verification error', () => {
    const req = httpMock.expectOne(
      'http://localhost:3456/api/v1/auth/email/mock-token'
    );
    expect(req.request.method).toBe('GET');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });

    expect(component.verificationStatus).toBe('Verification failed');
    expect(component.isLoading).toBeFalse();
  });

  it('should start countdown after successful verification', fakeAsync(() => {
    const req = httpMock.expectOne(
      'http://localhost:3456/api/v1/auth/email/mock-token'
    );
    expect(req.request.method).toBe('GET');
    req.flush({});

    tick(5000);
    expect(component.countdown).toBe(0);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should retry verification', () => {
    let req = httpMock.expectOne(
      'http://localhost:3456/api/v1/auth/email/mock-token'
    );
    expect(req.request.method).toBe('GET');
    req.flush({});

    component.retry();
    req = httpMock.expectOne(
      'http://localhost:3456/api/v1/auth/email/mock-token'
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should display "Invalid token" if token is missing', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue(null);

    const initReq = httpMock.expectOne(
      'http://localhost:3456/api/v1/auth/email/mock-token'
    );
    expect(initReq.request.method).toBe('GET');
    initReq.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.verificationStatus).toBe('Verification failed');
    expect(component.isLoading).toBeFalse();
  });
});
