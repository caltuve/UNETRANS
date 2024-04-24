import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarUcModalComponent } from './modificar-uc-modal.component';

describe('ModificarUcModalComponent', () => {
  let component: ModificarUcModalComponent;
  let fixture: ComponentFixture<ModificarUcModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarUcModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarUcModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
