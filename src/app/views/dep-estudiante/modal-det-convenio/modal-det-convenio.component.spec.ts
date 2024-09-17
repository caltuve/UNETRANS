import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetConvenioComponent } from './modal-det-convenio.component';

describe('ModalDetConvenioComponent', () => {
  let component: ModalDetConvenioComponent;
  let fixture: ComponentFixture<ModalDetConvenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetConvenioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
