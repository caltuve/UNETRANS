import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MallaAcademicaComponent } from './malla-academica.component';

describe('MallaAcademicaComponent', () => {
  let component: MallaAcademicaComponent;
  let fixture: ComponentFixture<MallaAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MallaAcademicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MallaAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
