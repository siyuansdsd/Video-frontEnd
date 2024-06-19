import { Routes } from '@angular/router';
import { RegisterComponent } from './components/registerPage/register.component';
import { LoginComponent } from './components/loginPage/login.component';
// import { VideoUploadComponent } from './components/videoPage/videoUpload/videoUpload.component';
import { EmailVerifyComponent } from './components/emailVerifyPage.ts/emailVerify.component';
import { VideoComponent } from './components/videoPage/video.component';
import { VideoPlayerComponent } from './components/videoPlayer/videoPlayer.component';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'video',
    component: VideoComponent,
  },
  {
    path: 'email_verify/:token',
    component: EmailVerifyComponent,
  },
  {
    path: 'video/:id',
    component: VideoPlayerComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
