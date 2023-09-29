import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeAcademicoComponent } from './ce-academico.component';

describe('CeAcademicoComponent', () => {
  let component: CeAcademicoComponent;
  let fixture: ComponentFixture<CeAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CeAcademicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
