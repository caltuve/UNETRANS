import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAspiranteComponent } from './login-aspirante.component';

describe('LoginAspiranteComponent', () => {
  let component: LoginAspiranteComponent;
  let fixture: ComponentFixture<LoginAspiranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginAspiranteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginAspiranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
