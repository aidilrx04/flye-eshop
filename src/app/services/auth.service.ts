import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private user?: UserModel;

  init() {
    return this.http
      .post(`${environment.apiUrl}/auth/verify`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .pipe(
        tap((response: { [key: string]: any }) => {
          this.user = {
            id: response?.['id'] ?? -1,
            full_name: response?.['full_name'] ?? '',
            email: response?.['email'] ?? '',
            email_verified_at: response?.['email_verified_at'] ?? null,
            created_at: response?.['created_at']
              ? new Date(response?.['created_at'])
              : new Date(0),
            updated_at: response?.['updated_at']
              ? new Date(response?.['updated_at'])
              : new Date(0),
          };
        }),
        catchError((error) => {
          console.error(
            'Failed to verify token. Token is missing/invalid:',
            error?.message,
          );
          return of(null);
        }),
      );
  }

  signUp(email: string, fullName: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/signup`, {
      email,
      full_name: fullName,
      password,
    });
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/signin`, {
      email,
      password,
    });
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return !!this.user;
  }
}
