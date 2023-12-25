import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnidadCurricularModalComponent } from './add-unidad-curricular-modal.component';

describe('AddUnidadCurricularModalComponent', () => {
  let component: AddUnidadCurricularModalComponent;
  let fixture: ComponentFixture<AddUnidadCurricularModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUnidadCurricularModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUnidadCurricularModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
