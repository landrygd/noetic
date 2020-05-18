import { TestBed, async, inject } from '@angular/core/testing';

import { NetworkGuard } from './network.guard';

describe('NetworkGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkGuard]
    });
  });

  it('should ...', inject([NetworkGuard], (guard: NetworkGuard) => {
    expect(guard).toBeTruthy();
  }));
});
