import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArancelesComponent } from './aranceles.component';

describe('ArancelesComponent', () => {
  let component: ArancelesComponent;
  let fixture: ComponentFixture<ArancelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArancelesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArancelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
