import { createAction, props } from '@ngrx/store';
import { Video } from '../../interface/video';

// load videos actions

export const loadVideos = createAction(
  '[Video] Load Videos',
  props<{ id: string }>()
);

export const loadVideosSuccess = createAction(
  '[Video] Load Videos Success',
  props<{ videos: Video[] }>()
);
export const loadVideosFailure = createAction(
  '[Video] Load Videos Failure',
  props<{ error: Error }>()
);
