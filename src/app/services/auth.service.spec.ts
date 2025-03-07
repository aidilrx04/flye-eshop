import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { UserModel } from '../models/user.model';
import { UserRole } from '../enums/user-role';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call init and set user subject if token is valid', () => {
    const mockUser: UserModel = {
      id: 1,
      email: 'test@example.com',
      full_name: 'Test User',
      created_at: new Date(0),
      updated_at: new Date(0),
      email_verified_at: null,
      role: UserRole.USER,
    };
    localStorage.setItem('token', 'mockToken');

    service.init().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/verify`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);

    expect(service.getUser()).toBe(mockUser);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return null if verification fail', () => {
    localStorage.setItem('token', 'mockToken');

    service.init().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/verify`);
    req.flush(null, {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(service.getUser()).toBe(null);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should sign up a new user', () => {
    const email = 'test@example.com';
    const fullName = 'Test User';
    const password = '123123';

    service.signUp(email, fullName, password).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ email, full_name: fullName, password });
  });

  it('should sign in a user', () => {
    const email = 'test@example.com';
    const password = '123123';

    service.signIn(email, password).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signin`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
  });

  it('should call sign out', () => {
    service.signOut().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signout`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(null);
  });

  it('should update current user new user data', () => {
    const mockUser: UserModel = {
      id: 1,
      email: 'test@example.com',
      full_name: 'Test User',
      created_at: new Date(0),
      updated_at: new Date(0),
      email_verified_at: null,
      role: UserRole.USER,
    };

    service.init().subscribe();

    const mockInit = httpMock.expectOne(`${environment.apiUrl}/auth/verify`);
    mockInit.flush(mockUser);

    const newData = { full_name: 'New Full Name' };
    const updatedRes = { data: { ...mockUser, ...newData } };

    service.updateCurrentUser(newData).subscribe((res) => {
      expect(res.data.full_name).toEqual(newData.full_name);
      expect(service.getUser()?.full_name).toBe(mockUser.full_name);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/users/${mockUser.id}?_method=PUT`,
    );
    expect(req.request.method).toBe('POST');
  });
});
