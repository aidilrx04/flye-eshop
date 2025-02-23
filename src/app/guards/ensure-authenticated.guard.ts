import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, switchMap } from 'rxjs';

export const ensureAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /**
   * Wait for Auth service initialization to completed
   * and check if user is authenticated or not
   * before return a true or false
   *
   */
  return authService.initCompletedSubject.asObservable().pipe(
    // make sure to emit run all subsequent operator only if the initialization is completed
    filter((initCompleted) => initCompleted === true),
    switchMap((_) => {
      return authService.user$.pipe(
        map((user) => {
          // user can possibly be a null or UserModel object
          if (!!user === false) {
            router.navigate(['/signin']);
            return false;
          }

          return true;
        }),
      );
    }),
  );
};
