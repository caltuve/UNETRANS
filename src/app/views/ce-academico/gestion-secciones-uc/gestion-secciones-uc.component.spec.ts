import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSeccionesUcComponent } from './gestion-secciones-uc.component';

describe('GestionSeccionesUcComponent', () => {
  let component: GestionSeccionesUcComponent;
  let fixture: ComponentFixture<GestionSeccionesUcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionSeccionesUcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionSeccionesUcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
