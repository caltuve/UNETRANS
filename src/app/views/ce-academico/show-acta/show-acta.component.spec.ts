import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowActaComponent } from './show-acta.component';

describe('ShowActaComponent', () => {
  let component: ShowActaComponent;
  let fixture: ComponentFixture<ShowActaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowActaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowActaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
