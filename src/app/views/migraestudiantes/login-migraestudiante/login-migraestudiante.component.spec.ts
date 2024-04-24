import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMigraestudianteComponent } from './login-migraestudiante.component';

describe('LoginMigraestudianteComponent', () => {
  let component: LoginMigraestudianteComponent;
  let fixture: ComponentFixture<LoginMigraestudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginMigraestudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginMigraestudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
