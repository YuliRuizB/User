import { TestBed } from '@angular/core/testing';

import { TraccarService } from './traccar.service';

describe('TraccarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraccarService = TestBed.get(TraccarService);
    expect(service).toBeTruthy();
  });
});
