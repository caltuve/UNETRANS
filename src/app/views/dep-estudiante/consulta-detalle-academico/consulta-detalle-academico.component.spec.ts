import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDetalleAcademicoComponent } from './consulta-detalle-academico.component';

describe('ConsultaDetalleAcademicoComponent', () => {
  let component: ConsultaDetalleAcademicoComponent;
  let fixture: ComponentFixture<ConsultaDetalleAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaDetalleAcademicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaDetalleAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
