import { TestBed } from '@angular/core/testing';

import { MigrastudentService } from './migrastudent.service';

describe('MigrastudentService', () => {
  let service: MigrastudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MigrastudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
