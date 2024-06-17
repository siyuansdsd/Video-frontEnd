import { Routes } from '@angular/router';
import { RegisterComponent } from './components/registerPage/register.component';
import { LoginComponent } from './components/loginPage/login.component';
import { VideoUploadComponent } from './components/videoPage/videoUpload/videoUpload.component';
import { EmailVerifyComponent } from './components/emailVerifyPage.ts/emailVerify.component';

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
    path: 'video_upload',
    component: VideoUploadComponent,
  },
  {
    path: 'email_verify/:token',
    component: EmailVerifyComponent,
  },
];
