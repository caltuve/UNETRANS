import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddModAspiranteComponent } from './modal-add-mod-aspirante.component';

describe('ModalAddModAspiranteComponent', () => {
  let component: ModalAddModAspiranteComponent;
  let fixture: ComponentFixture<ModalAddModAspiranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddModAspiranteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddModAspiranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
