import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleActaCalificacionesDocenteComponent } from './detalle-acta-calificaciones-docente.component';

describe('DetalleActaCalificacionesDocenteComponent', () => {
  let component: DetalleActaCalificacionesDocenteComponent;
  let fixture: ComponentFixture<DetalleActaCalificacionesDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleActaCalificacionesDocenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleActaCalificacionesDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
