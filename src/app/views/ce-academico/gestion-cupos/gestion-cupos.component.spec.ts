import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCuposComponent } from './gestion-cupos.component';

describe('GestionCuposComponent', () => {
  let component: GestionCuposComponent;
  let fixture: ComponentFixture<GestionCuposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionCuposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCuposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
