import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './store/reducers/auth.reducer';
import { videoReducer } from './store/reducers/video.reducer';
import { VideoEffect } from './store/effects/video.effect';
import { AuthEffects } from './store/effects/auth.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore({ auth: authReducer, video: videoReducer }),
    provideEffects([AuthEffects, VideoEffect]),
  ],
};
