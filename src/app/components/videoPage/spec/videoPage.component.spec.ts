import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { VideoComponent } from '../video.component';
import { Router } from '@angular/router';
import { getUser } from '../../../store/selectors/auth.selector';
import { User } from '../../../interface/user';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { VideoListComponent } from '../videoList/videoList.component';
import { VideoUploadComponent } from '../videoUpload/videoUpload.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;
  let store: MockStore;
  let router: Router;

  const initialState = {
    auth: {
      user: null,
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        StoreModule.forRoot({}),
        VideoListComponent,
        VideoUploadComponent,
        VideoComponent,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if user is not logged in', () => {
    const navigateSpy = spyOn(router, 'navigate');

    store.overrideSelector(getUser, null);
    store.refreshState();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should not navigate to login if user is logged in', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const mockUser: User = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    } as unknown as User;

    store.overrideSelector(getUser, mockUser);
    store.refreshState();
    fixture.detectChanges();

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
