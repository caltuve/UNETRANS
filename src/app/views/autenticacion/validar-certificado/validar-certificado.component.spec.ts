import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarCertificadoComponent } from './validar-certificado.component';

describe('ValidarCertificadoComponent', () => {
  let component: ValidarCertificadoComponent;
  let fixture: ComponentFixture<ValidarCertificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidarCertificadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
