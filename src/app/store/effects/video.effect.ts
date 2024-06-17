import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { VideoService } from '../../services/video/video.service';
import * as VideoActions from '../actions/video.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class VideoEffect {
  loadVideos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VideoActions.loadVideos),
      switchMap(() => {
        return this.videoService.getVideos().pipe(
          map((videos) => {
            return VideoActions.loadVideosSuccess({ videos });
          }),
          catchError((error) => {
            return of(VideoActions.loadVideosFailure({ error }));
          })
        );
      })
    );
  });

  constructor(private actions$: Actions, private videoService: VideoService) {}
}
