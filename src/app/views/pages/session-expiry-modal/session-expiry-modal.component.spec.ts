import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiryModalComponent } from './session-expiry-modal.component';

describe('SessionExpiryModalComponent', () => {
  let component: SessionExpiryModalComponent;
  let fixture: ComponentFixture<SessionExpiryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionExpiryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionExpiryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
