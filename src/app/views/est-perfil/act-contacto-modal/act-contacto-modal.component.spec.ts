import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActContactoModalComponent } from './act-contacto-modal.component';

describe('ActContactoModalComponent', () => {
  let component: ActContactoModalComponent;
  let fixture: ComponentFixture<ActContactoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActContactoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActContactoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
