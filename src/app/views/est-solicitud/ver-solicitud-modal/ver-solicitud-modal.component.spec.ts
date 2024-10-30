import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSolicitudModalComponent } from './ver-solicitud-modal.component';

describe('VerSolicitudModalComponent', () => {
  let component: VerSolicitudModalComponent;
  let fixture: ComponentFixture<VerSolicitudModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerSolicitudModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSolicitudModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
