import { TestBed } from '@angular/core/testing';

import { AuthDisconnectedGuard } from './auth-disconnected.guard';

describe('AuthDisconnectedGuard', () => {
  let guard: AuthDisconnectedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthDisconnectedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
