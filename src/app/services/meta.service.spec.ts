import { TestBed } from '@angular/core/testing';

import { MetaService } from './meta.service';

describe('PageService', () => {
  let service: MetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
