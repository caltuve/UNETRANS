import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaEleccionPresidencialComponent } from './estadistica-eleccion-presidencial.component';

describe('EstadisticaEleccionPresidencialComponent', () => {
  let component: EstadisticaEleccionPresidencialComponent;
  let fixture: ComponentFixture<EstadisticaEleccionPresidencialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticaEleccionPresidencialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticaEleccionPresidencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
