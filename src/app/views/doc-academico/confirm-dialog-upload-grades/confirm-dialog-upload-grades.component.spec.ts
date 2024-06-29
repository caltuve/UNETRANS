import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogUploadGradesComponent } from './confirm-dialog-upload-grades.component';

describe('ConfirmDialogUploadGradesComponent', () => {
  let component: ConfirmDialogUploadGradesComponent;
  let fixture: ComponentFixture<ConfirmDialogUploadGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogUploadGradesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogUploadGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
