import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkAuthenticationGuard } from './check-authentication.guard';

describe('checkAuthenticationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkAuthenticationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
