import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstantesGlobalesComponent } from './constantes-globales.component';

describe('ConstantesGlobalesComponent', () => {
  let component: ConstantesGlobalesComponent;
  let fixture: ComponentFixture<ConstantesGlobalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstantesGlobalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstantesGlobalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
