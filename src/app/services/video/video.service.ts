import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getUser } from '../../store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom, tap, switchMap } from 'rxjs';
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
    return this.store.select(getUser).pipe(
      tap((user) => console.log('Fetched user: ', user)),
      switchMap((user) => {
        if (!user) {
          console.error('User not found');
        }
        const userId = user?.id;
        const accessToken = sessionStorage.getItem('accessToken');
        console.log('userId: ', userId, 'accessToken: ', accessToken);
        const headers = new HttpHeaders().set(
          'Authorization',
          `${accessToken}`
        );
        return this.http.get<Video[]>(`${this.apiUrl}/video/user/${userId}`, {
          headers,
        });
      })
    );
  }

  deleteVideo(id: string): Observable<void> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `${sessionStorage.getItem('accessToken')}`
    );
    return this.http.delete<void>(`${this.apiUrl}/video/${id}`, { headers });
  }
}
