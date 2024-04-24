import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomigraEstudianteComponent } from './automigra-estudiante.component';

describe('AutomigraEstudianteComponent', () => {
  let component: AutomigraEstudianteComponent;
  let fixture: ComponentFixture<AutomigraEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomigraEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomigraEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
