import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasConvenioProgramaComponent } from './estadisticas-convenio-programa.component';

describe('EstadisticasConvenioProgramaComponent', () => {
  let component: EstadisticasConvenioProgramaComponent;
  let fixture: ComponentFixture<EstadisticasConvenioProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticasConvenioProgramaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasConvenioProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
