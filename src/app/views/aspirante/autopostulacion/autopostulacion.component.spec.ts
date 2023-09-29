import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutopostulacionComponent } from './autopostulacion.component';

describe('AutopostulacionComponent', () => {
  let component: AutopostulacionComponent;
  let fixture: ComponentFixture<AutopostulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutopostulacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutopostulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
