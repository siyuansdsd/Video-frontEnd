import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getUser } from '../../store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { Video } from '../../interface/video';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://localhost:3456/api/v1';
  constructor(private http: HttpClient, private store: Store) {}

  async uploadVideo(video: File, title: string, description: string) {
    const formData = new FormData();
    const user = await firstValueFrom(this.store.select(getUser));
    if (!user) {
      throw new Error('User not found');
    }
    const userId = user.id;
    console.log('user: ', userId);
    formData.append('file', video);
    formData.append('title', title);
    formData.append('user_ids', String(userId));
    formData.append('description', description);
    const headers = new HttpHeaders().set(
      'Authorization',
      `${sessionStorage.getItem('accessToken')}`
    );
    return this.http.post(`${this.apiUrl}/video`, formData, { headers });
  }

  getVideos(): Observable<Video[]> {
    const userId = sessionStorage.getItem('userId');
    return this.http.get<Video[]>(`${this.apiUrl}/video/user/${userId}`);
  }
}
