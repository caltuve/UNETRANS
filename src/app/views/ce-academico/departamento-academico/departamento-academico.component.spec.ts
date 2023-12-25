import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoAcademicoComponent } from './departamento-academico.component';

describe('DepartamentoAcademicoComponent', () => {
  let component: DepartamentoAcademicoComponent;
  let fixture: ComponentFixture<DepartamentoAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartamentoAcademicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartamentoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
