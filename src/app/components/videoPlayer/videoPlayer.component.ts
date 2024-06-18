import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getLogin } from '../../store/selectors/auth.selector';
import { Video } from '../../interface/video';

@Component({
  standalone: true,
  selector: 'app-video-player',
  templateUrl: './videoPlayer.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
  ],
})
export class VideoPlayerComponent implements OnInit {
  video$: Observable<Video>;
  login$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {
    this.login$ = this.store.select(getLogin);
    this.video$ = this.route.paramMap.pipe(
      switchMap((params) => this.getVideo(params.get('id')!))
    );
  }

  ngOnInit() {
    this.login$.subscribe((login) => {
      if (!login) {
        this.router.navigate(['/login']);
      }
    });
  }

  getVideo(id: string): Observable<Video> {
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `${accessToken}`);
    return this.http.get<Video>(`http://localhost:3456/api/v1/video/${id}`, {
      headers,
    });
  }

  goBack() {
    this.router.navigate(['/video']);
  }
}
