import { TestBed, tick } from '@angular/core/testing';
import { CanActivateFn, GuardResult, Router } from '@angular/router';

import { ensureUserIsAdminGuard } from './ensure-user-is-admin.guard';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { UserRole } from '../enums/user-role';

describe('ensureUserIsAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      ensureUserIsAdminGuard(...guardParameters),
    );
  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let initCompletedSubject: BehaviorSubject<boolean>;
  let userSubject: BehaviorSubject<UserModel | null>;

  beforeEach(() => {
    initCompletedSubject = new BehaviorSubject(false);
    userSubject = new BehaviorSubject<UserModel | null>(null);
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [], {
      user$: userSubject.asObservable(),
      initCompletedSubject: initCompletedSubject,
    });

    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: routerMock,
        },
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

  it('should allow navigation when user is an admin', () => {
    initCompletedSubject.next(true);
    userSubject.next({ role: UserRole.ADMIN } as any);

    (executeGuard({} as any, {} as any) as Observable<GuardResult>).subscribe(
      (result) => {
        expect(result).toBeTruthy();
      },
    );
  });

  it('should redirect user to / route when not authorized', () => {
    initCompletedSubject.next(true);
    userSubject.next({ role: UserRole.USER } as any);

    (executeGuard({} as any, {} as any) as Observable<GuardResult>).subscribe(
      (result) => {
        expect(result).toBeFalse();
      },
    );

    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should wait for AuthService.init before emit', (done) => {
    let emitted = false;

    (executeGuard({} as any, {} as any) as Observable<GuardResult>).subscribe(
      () => {
        emitted = true;
      },
    );

    setTimeout(() => {
      expect(emitted).toBeFalse();
      initCompletedSubject.next(true);
      userSubject.next(null);

      setTimeout(() => {
        expect(emitted).toBeTrue();
        done();
      });
    }, 100);
  });
});
