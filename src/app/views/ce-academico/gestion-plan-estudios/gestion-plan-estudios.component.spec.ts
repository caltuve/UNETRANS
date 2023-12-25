import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlanEstudiosComponent } from './gestion-plan-estudios.component';

describe('GestionPlanEstudiosComponent', () => {
  let component: GestionPlanEstudiosComponent;
  let fixture: ComponentFixture<GestionPlanEstudiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPlanEstudiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPlanEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
