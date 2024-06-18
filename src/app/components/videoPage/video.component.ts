import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoListComponent } from './videoList/videoList.component';
import { VideoUploadComponent } from './videoUpload/videoUpload.component';
import { Store } from '@ngrx/store';
import { getUser } from '../../store/selectors/auth.selector';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../interface/user';

@Component({
  standalone: true,
  selector: 'app-video',
  templateUrl: './video.component.html',
  imports: [CommonModule, VideoListComponent, VideoUploadComponent],
})
export class VideoComponent implements OnInit {
  user$: Observable<User | null>;
  constructor(private store: Store, private router: Router) {
    this.user$ = this.store.select(getUser);
  }

  ngOnInit() {
    this.user$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }
}
