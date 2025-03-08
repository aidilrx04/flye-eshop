import { TestBed } from '@angular/core/testing';
import { CanActivateFn, GuardResult } from '@angular/router';

import { checkAuthenticationGuard } from './check-authentication.guard';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';

describe('checkAuthenticationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      checkAuthenticationGuard(...guardParameters),
    );
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [
      'init',
    ]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when AuthService.init() completes successfully', (done) => {
    authServiceMock.init.and.returnValue(of({} as any)); // Mock successful initialization

    (executeGuard({} as any, {} as any) as Observable<GuardResult>).subscribe(
      (result) => {
        expect(result).toBeTrue();
        expect(authServiceMock.init).toHaveBeenCalled();
        done();
      },
    );
  });

  it('should return true even if AuthService.init() returns an empty observable', (done) => {
    authServiceMock.init.and.returnValue(of(null)); // Empty observable

    (executeGuard({} as any, {} as any) as Observable<GuardResult>).subscribe(
      (result) => {
        expect(result).toBeTrue();
        done();
      },
    );
  });
});
