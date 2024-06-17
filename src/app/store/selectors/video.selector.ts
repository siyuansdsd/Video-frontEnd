import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VideoState } from '../reducers/video.reducer';

const getVideoState = createFeatureSelector<VideoState>('video');

export const getVideos = createSelector(
  getVideoState,
  (state: VideoState) => state.videos
);

export const getError = createSelector(
  getVideoState,
  (state: VideoState) => state.error
);
