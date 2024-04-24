import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaCalificacionesComponent } from './carga-calificaciones.component';

describe('CargaCalificacionesComponent', () => {
  let component: CargaCalificacionesComponent;
  let fixture: ComponentFixture<CargaCalificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaCalificacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaCalificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
