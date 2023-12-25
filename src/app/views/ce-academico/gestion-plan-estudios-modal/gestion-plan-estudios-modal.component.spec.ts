import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlanEstudiosModalComponent } from './gestion-plan-estudios-modal.component';

describe('GestionPlanEstudiosModalComponent', () => {
  let component: GestionPlanEstudiosModalComponent;
  let fixture: ComponentFixture<GestionPlanEstudiosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPlanEstudiosModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPlanEstudiosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
