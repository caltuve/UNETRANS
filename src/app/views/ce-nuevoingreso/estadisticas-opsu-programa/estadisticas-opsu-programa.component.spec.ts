import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasOpsuProgramaComponent } from './estadisticas-opsu-programa.component';

describe('EstadisticasOpsuProgramaComponent', () => {
  let component: EstadisticasOpsuProgramaComponent;
  let fixture: ComponentFixture<EstadisticasOpsuProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticasOpsuProgramaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasOpsuProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
