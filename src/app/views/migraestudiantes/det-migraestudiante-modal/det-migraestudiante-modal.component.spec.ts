import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetMigraestudianteModalComponent } from './det-migraestudiante-modal.component';

describe('DetMigraestudianteModalComponent', () => {
  let component: DetMigraestudianteModalComponent;
  let fixture: ComponentFixture<DetMigraestudianteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetMigraestudianteModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetMigraestudianteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
