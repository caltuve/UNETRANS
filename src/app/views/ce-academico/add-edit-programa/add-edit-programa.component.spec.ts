import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProgramaComponent } from './add-edit-programa.component';

describe('AddEditProgramaComponent', () => {
  let component: AddEditProgramaComponent;
  let fixture: ComponentFixture<AddEditProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProgramaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
