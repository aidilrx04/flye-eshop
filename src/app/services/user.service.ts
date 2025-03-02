import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseModel } from '../models/api-response.model';
import { APIResponsePaginateModel } from '../models/api-response-paginate.model';
import { QueryModel } from '../models/query.model';
import { QueryBuilder } from '../classes/query-builder';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(query: QueryModel = {}) {
    const queryString = QueryBuilder.buildQueryParam(query);
    return this.http.get<APIResponsePaginateModel<UserModel>>(
      `${environment.apiUrl}/users?${queryString}`,
    );
  }

  deleteUser(userId: number) {
    return this.http.delete(`${environment.apiUrl}/users/${userId}`);
  }
}
