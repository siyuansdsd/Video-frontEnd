import { createReducer, on } from '@ngrx/store';
import * as VideoActions from '../actions/video.action';
import { Video } from '../../interface/video';

export interface VideoState {
  videos: Video[] | null;
  error: Error | null;
}

export const initialState: VideoState = {
  videos: null,
  error: null,
};

export const videoReducer = createReducer(
  initialState,
  on(VideoActions.loadVideosSuccess, (state, { videos }) => ({
    ...state,
    videos,
    error: null,
  })),
  on(VideoActions.loadVideosFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);