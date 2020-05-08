import { TestBed } from '@angular/core/testing';

import { SlidesService } from './slides.service';

describe('SlidesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlidesService = TestBed.get(SlidesService);
    expect(service).toBeTruthy();
  });
});
