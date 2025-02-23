import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ensureAuthenticatedGuard } from './ensure-authenticated.guard';

describe('ensureAuthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      ensureAuthenticatedGuard(...guardParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
