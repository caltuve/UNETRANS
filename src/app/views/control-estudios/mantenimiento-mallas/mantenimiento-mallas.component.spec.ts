import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoMallasComponent } from './mantenimiento-mallas.component';

describe('MantenimientoMallasComponent', () => {
  let component: MantenimientoMallasComponent;
  let fixture: ComponentFixture<MantenimientoMallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenimientoMallasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoMallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
