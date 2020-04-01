import { TestBed } from '@angular/core/testing';

import { PredectionService } from './predection.service';

describe('PredectionServiceService', () => {
  let service: PredectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
