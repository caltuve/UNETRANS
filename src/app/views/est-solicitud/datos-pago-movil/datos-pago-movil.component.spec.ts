import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPagoMovilComponent } from './datos-pago-movil.component';

describe('DatosPagoMovilComponent', () => {
  let component: DatosPagoMovilComponent;
  let fixture: ComponentFixture<DatosPagoMovilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosPagoMovilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosPagoMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
