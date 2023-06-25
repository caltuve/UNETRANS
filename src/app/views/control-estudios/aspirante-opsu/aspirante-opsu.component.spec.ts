import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspiranteOpsuComponent } from './aspirante-opsu.component';

describe('AspiranteOpsuComponent', () => {
  let component: AspiranteOpsuComponent;
  let fixture: ComponentFixture<AspiranteOpsuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AspiranteOpsuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspiranteOpsuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
