import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleVotanteComponent } from './modal-detalle-votante.component';

describe('ModalDetalleVotanteComponent', () => {
  let component: ModalDetalleVotanteComponent;
  let fixture: ComponentFixture<ModalDetalleVotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetalleVotanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleVotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
