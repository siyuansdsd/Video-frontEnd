import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { VideoPlayerComponent } from '../videoPlayer.component';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

const time = new Date();

describe('VideoPlayerComponent', () => {
  let component: VideoPlayerComponent;
  let fixture: ComponentFixture<VideoPlayerComponent>;
  let httpMock: HttpTestingController;
  let store: MockStore;
  let router: Router;

  const initialState = { auth: { login: true } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot({}),
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        VideoPlayerComponent,
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => 'mock-id',
            }),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store) as MockStore;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // Mock router.navigate
    fixture.detectChanges();
    const req = httpMock.expectOne(
      'http://localhost:3456/api/v1/video/mock-id'
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if not logged in', () => {
    store.setState({ auth: { login: false } });
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fetch video on initialization', () => {
    component.video$.subscribe((video) => {
      expect(video).toEqual({
        id: 'mock-id',
        title: 'Test Video',
        description: '',
        url: '',
        created_at: time,
        user_ids: '',
        size: 0,
      });
    });

    const req = httpMock.expectOne(
      'http://localhost:3456/api/v1/video/mock-id'
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 'mock-id',
      title: 'Test Video',
      description: '',
      url: '',
      created_at: time,
      user_ids: '',
      size: 0,
    });
  });

  it('should navigate back to video list on goBack', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/video']);
  });
});
