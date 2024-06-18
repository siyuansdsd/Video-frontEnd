import { createReducer, on } from '@ngrx/store';
import * as VideoActions from '../actions/video.action';
import { Video } from '../../interface/video';

export interface VideoState {
  videos: Video[];
  loading: boolean;
  error: Error | null;
}

export const initialState: VideoState = {
  videos: [],
  loading: false,
  error: null,
};

export const videoReducer = createReducer(
  initialState,
  on(VideoActions.loadVideos, (state) => ({ ...state, loading: true })),
  on(VideoActions.loadVideosSuccess, (state, { videos }) => ({
    ...state,
    loading: false,
    videos,
  })),
  on(VideoActions.loadVideosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(VideoActions.deleteVideoSuccess, (state, { id }) => ({
    ...state,
    videos: state.videos.filter((video) => video.id !== id),
  })),
  on(VideoActions.deleteVideoFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
