import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInscripcionComponent } from './modal-inscripcion.component';

describe('ModalInscripcionComponent', () => {
  let component: ModalInscripcionComponent;
  let fixture: ComponentFixture<ModalInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInscripcionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
