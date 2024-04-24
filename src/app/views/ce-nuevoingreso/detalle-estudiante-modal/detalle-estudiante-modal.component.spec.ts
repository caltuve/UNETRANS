import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEstudianteModalComponent } from './detalle-estudiante-modal.component';

describe('DetalleEstudianteModalComponent', () => {
  let component: DetalleEstudianteModalComponent;
  let fixture: ComponentFixture<DetalleEstudianteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleEstudianteModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEstudianteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
