import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResult } from '../../interface/loginResult';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3456/api/v1';
  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register`, {
      name,
      email,
      password,
    });
  }

  login(email: string, password: string): Observable<LoginResult> {
    return this.http
      .post<{ message: LoginResult }>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(map((response) => response.message));
  }

  refreshToken(refreshToken: string): Observable<string> {
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh`, {
        refreshToken,
      })
      .pipe(map((response) => response.accessToken));
  }
}
