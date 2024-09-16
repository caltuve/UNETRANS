import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleccionPresidencial2024Component } from './eleccion-presidencial2024.component';

describe('EleccionPresidencial2024Component', () => {
  let component: EleccionPresidencial2024Component;
  let fixture: ComponentFixture<EleccionPresidencial2024Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EleccionPresidencial2024Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleccionPresidencial2024Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
