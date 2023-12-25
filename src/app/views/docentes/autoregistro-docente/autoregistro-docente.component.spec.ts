import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoregistroDocenteComponent } from './autoregistro-docente.component';

describe('AutoregistroDocenteComponent', () => {
  let component: AutoregistroDocenteComponent;
  let fixture: ComponentFixture<AutoregistroDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoregistroDocenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoregistroDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
