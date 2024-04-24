import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarEstudianteModalComponent } from './modificar-estudiante-modal.component';

describe('ModificarEstudianteModalComponent', () => {
  let component: ModificarEstudianteModalComponent;
  let fixture: ComponentFixture<ModificarEstudianteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarEstudianteModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarEstudianteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
