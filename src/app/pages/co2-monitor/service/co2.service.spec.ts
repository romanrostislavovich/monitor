import { TestBed } from '@angular/core/testing';

import { Co2Service } from './co2.service';

describe('Co2Service', () => {
  let service: Co2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Co2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
