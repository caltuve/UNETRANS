import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFotoModalComponent } from './ver-foto-modal.component';

describe('VerFotoModalComponent', () => {
  let component: VerFotoModalComponent;
  let fixture: ComponentFixture<VerFotoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerFotoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFotoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
