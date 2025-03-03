import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponseModel } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // private user?: UserModel;
  private userSubject = new BehaviorSubject<UserModel | null>(null);
  user$ = this.userSubject.asObservable();

  initCompletedSubject = new BehaviorSubject(false);

  init() {
    // check if the init has been run before
    if (this.initCompletedSubject.value) {
      return of(null);
    }

    return this.http
      .post<UserModel>(`${environment.apiUrl}/auth/verify`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .pipe(
        tap((response) => {
          this.userSubject.next(response);
          this.initCompletedSubject.next(true);
        }),
        catchError((error) => {
          console.warn(
            'Failed to verify token. Token is missing/invalid:',
            error?.message,
          );
          this.initCompletedSubject.next(true);
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
    return this.userSubject.value;
  }

  isLoggedIn() {
    return !!this.userSubject.value;
  }

  signOut() {
    return this.http.post<any>(`${environment.apiUrl}/auth/signout`, null);
  }

  updateCurrentUser(newData: { full_name?: string; password?: string }) {
    return this.http
      .post<
        ApiResponseModel<UserModel>
      >(`${environment.apiUrl}/users/${this.getUser()!.id}?_method=PUT`, newData)
      .pipe(
        tap((newUserData) => {
          this.userSubject.next(newUserData.data);
        }),
      );
  }
}
