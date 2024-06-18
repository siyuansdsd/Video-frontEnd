import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { VideoService } from '../../services/video/video.service';
import * as VideoActions from '../actions/video.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Video } from '../../interface/video';

@Injectable()
export class VideoEffects {
  loadVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VideoActions.loadVideos),
      switchMap(() =>
        this.videoService.getVideos().pipe(
          map((videos: Video[]) => VideoActions.loadVideosSuccess({ videos })),
          catchError((error) =>
            of(VideoActions.loadVideosFailure({ error: error.error.message }))
          )
        )
      )
    )
  );

  deleteVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VideoActions.deleteVideo),
      switchMap(({ id }) =>
        this.videoService.deleteVideo(id).pipe(
          map(() => VideoActions.deleteVideoSuccess({ id })),
          catchError((error) => of(VideoActions.deleteVideoFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private videoService: VideoService) {}
}
