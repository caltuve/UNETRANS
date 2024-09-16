import { TestBed } from '@angular/core/testing';

import { AutenticacionCertificadosService } from './autenticacion-certificados.service';

describe('AutenticacionCertificadosService', () => {
  let service: AutenticacionCertificadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutenticacionCertificadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
