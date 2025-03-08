import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a list of users', () => {
    service.getUsers().subscribe((users) => {
      expect(users.data).toBeInstanceOf(Array);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users?`);
    expect(req.request.method).toEqual('GET');
    req.flush({ data: [] });
  });

  it('should delete a user', () => {
    service.deleteUser(1).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toEqual('DELETE');
  });
});
