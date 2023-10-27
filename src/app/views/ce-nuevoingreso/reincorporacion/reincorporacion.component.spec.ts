import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReincorporacionComponent } from './reincorporacion.component';

describe('ReincorporacionComponent', () => {
  let component: ReincorporacionComponent;
  let fixture: ComponentFixture<ReincorporacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReincorporacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReincorporacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
