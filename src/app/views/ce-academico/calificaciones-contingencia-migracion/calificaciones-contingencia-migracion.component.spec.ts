import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionesContingenciaMigracionComponent } from './calificaciones-contingencia-migracion.component';

describe('CalificacionesContingenciaMigracionComponent', () => {
  let component: CalificacionesContingenciaMigracionComponent;
  let fixture: ComponentFixture<CalificacionesContingenciaMigracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionesContingenciaMigracionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalificacionesContingenciaMigracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
