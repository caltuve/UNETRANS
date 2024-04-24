import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDocenteComponent } from './gestion-docente.component';

describe('GestionDocenteComponent', () => {
  let component: GestionDocenteComponent;
  let fixture: ComponentFixture<GestionDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionDocenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
