import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
  provideHttpClient,
} from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import { createLocalStorageMock } from '../../tests/helpers/local-storage.mock';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('authInterceptor', () => {
  // let httpMock: HttpTestingController;
  // let http: HttpClient;
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));
  let mockNext: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const localStorageSpy = spyOnProperty(
      window,
      'localStorage',
      'get',
    ).and.returnValue(createLocalStorageMock());
    // http = TestBed.inject(HttpClient);
    // httpMock = TestBed.inject(HttpTestingController);
    mockNext = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should set authorization headers when token is present', () => {
    localStorage.setItem('token', 'mockToken');

    const req = new HttpRequest('GET', 'http://localhost');

    interceptor(req, mockNext.handle);

    expect(mockNext.handle).toHaveBeenCalledWith(
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          headers: jasmine.any(Map),
        }),
      }),
    );

    const updatedReq = mockNext.handle.calls.mostRecent()
      .args[0] as HttpRequest<any>;
    expect(updatedReq.headers.get('Authorization')).toBe('Bearer mockToken');
  });
  it('should not set authorization header when token is missing', () => {
    const req = new HttpRequest('GET', 'http://localhost');

    interceptor(req, mockNext.handle);

    expect(mockNext.handle).toHaveBeenCalledWith(req);
  });
});
