import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActaCeComponent } from './edit-acta-ce.component';

describe('EditActaCeComponent', () => {
  let component: EditActaCeComponent;
  let fixture: ComponentFixture<EditActaCeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditActaCeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditActaCeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
