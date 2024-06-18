import { createAction, props } from '@ngrx/store';
import { Video } from '../../interface/video';

export const loadVideos = createAction('[Video] Load Videos');

export const loadVideosSuccess = createAction(
  '[Video] Load Videos Success',
  props<{ videos: Video[] }>()
);

export const loadVideosFailure = createAction(
  '[Video] Load Videos Failure',
  props<{ error: Error }>()
);

export const deleteVideo = createAction(
  '[Video] Delete Video',
  props<{ id: string }>()
);

export const deleteVideoSuccess = createAction(
  '[Video] Delete Video Success',
  props<{ id: string }>()
);

export const deleteVideoFailure = createAction(
  '[Video] Delete Video Failure',
  props<{ error: Error }>()
);
