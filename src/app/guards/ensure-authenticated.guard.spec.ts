import { TestBed } from '@angular/core/testing';
import { CanActivateFn, GuardResult, Router } from '@angular/router';

import { ensureAuthenticatedGuard } from './ensure-authenticated.guard';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

describe('ensureAuthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      ensureAuthenticatedGuard(...guardParameters),
    );

  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let initCompletedSubject: BehaviorSubject<boolean>;
  let userSubject: BehaviorSubject<any>;

  beforeEach(() => {
    initCompletedSubject = new BehaviorSubject<boolean>(false);
    userSubject = new BehaviorSubject<any>(null);

    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [], {
      initCompletedSubject,
      user$: userSubject.asObservable(),
    });

    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow navigation when user is authenticated', (done) => {
    initCompletedSubject.next(true); // Simulate auth initialization completed
    userSubject.next({ id: 1, name: 'John Doe' }); // Simulate logged-in user

    (executeGuard({} as any, {} as any) as Observable<GuardResult>).subscribe(
      (result) => {
        expect(result).toBeTrue();
        expect(routerMock.navigate).not.toHaveBeenCalled();
        done();
      },
    );
  });

  it('should redirect to /signin when user is not authenticated', (done) => {
    initCompletedSubject.next(true); // Simulate auth initialization completed
    userSubject.next(null); // Simulate no logged-in user

    (executeGuard({} as any, {} as any) as Observable<GuardResult>).subscribe(
      (result) => {
        expect(result).toBeFalse();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/signin']);
        done();
      },
    );
  });

  it('should not emit until auth initialization is completed', (done) => {
    let emitted = false;

    (executeGuard({} as any, {} as any) as Observable<GuardResult>).subscribe(
      () => {
        emitted = true;
      },
    );

    setTimeout(() => {
      expect(emitted).toBeFalse(); // Should not emit before initCompletedSubject is true
      initCompletedSubject.next(true); // Now complete initialization
      userSubject.next(null); // Simulate unauthenticated user
      setTimeout(() => {
        expect(emitted).toBeTrue(); // Now it should emit
        done();
      });
    }, 100);
  });
});
