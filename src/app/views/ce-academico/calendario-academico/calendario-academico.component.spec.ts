import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioAcademicoComponent } from './calendario-academico.component';

describe('CalendarioAcademicoComponent', () => {
  let component: CalendarioAcademicoComponent;
  let fixture: ComponentFixture<CalendarioAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioAcademicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
