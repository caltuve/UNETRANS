import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRevMigracionComponent } from './modal-rev-migracion.component';

describe('ModalRevMigracionComponent', () => {
  let component: ModalRevMigracionComponent;
  let fixture: ComponentFixture<ModalRevMigracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRevMigracionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRevMigracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
