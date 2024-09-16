import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPostMigracionPlanesEstudiosComponent } from './modal-post-migracion-planes-estudios.component';

describe('ModalPostMigracionPlanesEstudiosComponent', () => {
  let component: ModalPostMigracionPlanesEstudiosComponent;
  let fixture: ComponentFixture<ModalPostMigracionPlanesEstudiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPostMigracionPlanesEstudiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPostMigracionPlanesEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
