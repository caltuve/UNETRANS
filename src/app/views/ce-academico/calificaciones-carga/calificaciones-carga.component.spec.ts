import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionesCargaComponent } from './calificaciones-carga.component';

describe('CalificacionesCargaComponent', () => {
  let component: CalificacionesCargaComponent;
  let fixture: ComponentFixture<CalificacionesCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionesCargaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalificacionesCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
