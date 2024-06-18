import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Video } from '../../../interface/video';
import { loadVideos, deleteVideo } from '../../../store/actions/video.action';
import {
  getVideos,
  getVideosLoading,
} from '../../../store/selectors/video.selector';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-video-list',
  templateUrl: './videoList.component.html',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
})
export class VideoListComponent implements OnInit {
  videos$: Observable<Video[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router,
    private alertService: AlertService
  ) {
    this.videos$ = this.store.select(getVideos);
    this.isLoading$ = this.store.select(getVideosLoading);
  }

  ngOnInit() {
    this.refreshVideos();
  }

  refreshVideos() {
    this.store.dispatch(loadVideos());
  }

  playVideo(videoId: string) {
    this.router.navigate([`/video/${videoId}`]);
  }

  deleteVideo(videoId: string) {
    this.store.dispatch(deleteVideo({ id: videoId }));
    this.alertService.showSuccess('Video deleted');
  }
}
