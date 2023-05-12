import { TestBed } from '@angular/core/testing';

import { ControlEstudiosService } from './control-estudios.service';

describe('ControlEstudiosService', () => {
  let service: ControlEstudiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlEstudiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
