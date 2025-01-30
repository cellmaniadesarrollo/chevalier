import { TestBed } from '@angular/core/testing';

import { QuerieService } from './querie.service';

describe('QuerieService', () => {
  let service: QuerieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuerieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
