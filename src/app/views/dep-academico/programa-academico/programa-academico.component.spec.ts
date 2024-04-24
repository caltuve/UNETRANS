import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaAcademicoComponent } from './programa-academico.component';

describe('ProgramaAcademicoComponent', () => {
  let component: ProgramaAcademicoComponent;
  let fixture: ComponentFixture<ProgramaAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramaAcademicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramaAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
