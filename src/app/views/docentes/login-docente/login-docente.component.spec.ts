import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDocenteComponent } from './login-docente.component';

describe('LoginDocenteComponent', () => {
  let component: LoginDocenteComponent;
  let fixture: ComponentFixture<LoginDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginDocenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
