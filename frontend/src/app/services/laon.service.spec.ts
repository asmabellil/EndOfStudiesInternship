import { TestBed } from '@angular/core/testing';

import { LaonService } from './laon.service';

describe('LaonService', () => {
  let service: LaonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
