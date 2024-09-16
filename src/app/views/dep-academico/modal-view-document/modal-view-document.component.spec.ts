import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewDocumentComponent } from './modal-view-document.component';

describe('ModalViewDocumentComponent', () => {
  let component: ModalViewDocumentComponent;
  let fixture: ComponentFixture<ModalViewDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalViewDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalViewDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
