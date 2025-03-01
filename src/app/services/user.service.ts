import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseModel } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http
      .get<ApiResponseModel<UserModel[]>>(`${environment.apiUrl}/users`)
      .pipe(map((value) => value.data));
  }

  deleteUser(userId: number) {
    return this.http.delete(`${environment.apiUrl}/users/${userId}`);
  }
}
