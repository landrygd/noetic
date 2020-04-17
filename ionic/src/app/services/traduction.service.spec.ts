import { TestBed } from '@angular/core/testing';

import { TraductionService } from './traductionService.service';

describe('TraductionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraductionService = TestBed.get(TraductionService);
    expect(service).toBeTruthy();
  });
});
