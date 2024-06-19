import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { VideoListComponent } from '../videoList.component';
import {
  loadVideos,
  deleteVideo,
} from '../../../../store/actions/video.action';
import { AlertService } from '../../../../services/alert/alert.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';

describe('VideoListComponent', () => {
  let component: VideoListComponent;
  let fixture: ComponentFixture<VideoListComponent>;
  let store: MockStore;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: Router;

  const initialState = {
    videos: [],
    loading: false,
  };

  beforeEach(waitForAsync(() => {
    const alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'showSuccess',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatListModule,
        MatProgressSpinnerModule,
        StoreModule.forRoot({}),
        RouterTestingModule,
        VideoListComponent, // 将组件添加到 imports 中
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(VideoListComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadVideos on init', () => {
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(loadVideos());
  });

  it('should dispatch loadVideos when refreshVideos is called', () => {
    spyOn(store, 'dispatch');
    component.refreshVideos();
    expect(store.dispatch).toHaveBeenCalledWith(loadVideos());
  });

  it('should navigate to video page when playVideo is called', () => {
    component.playVideo('test-id');
    expect(router.navigate).toHaveBeenCalledWith(['/video/test-id']);
  });

  it('should dispatch deleteVideo and show success message when deleteVideo is called', () => {
    spyOn(store, 'dispatch');
    component.deleteVideo('test-id');
    expect(store.dispatch).toHaveBeenCalledWith(deleteVideo({ id: 'test-id' }));
    expect(alertService.showSuccess).toHaveBeenCalledWith('Video deleted');
  });
});
