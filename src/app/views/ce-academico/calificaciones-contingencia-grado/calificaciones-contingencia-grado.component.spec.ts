import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionesContingenciaGradoComponent } from './calificaciones-contingencia-grado.component';

describe('CalificacionesContingenciaGradoComponent', () => {
  let component: CalificacionesContingenciaGradoComponent;
  let fixture: ComponentFixture<CalificacionesContingenciaGradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionesContingenciaGradoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalificacionesContingenciaGradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
