import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VideoState } from '../reducers/video.reducer';

const getVideoState = createFeatureSelector<VideoState>('video');

export const getVideos = createSelector(getVideoState, (state) => state.videos);

export const getVideosLoading = createSelector(
  getVideoState,
  (state) => state.loading
);

export const getVideosError = createSelector(
  getVideoState,
  (state) => state.error
);
