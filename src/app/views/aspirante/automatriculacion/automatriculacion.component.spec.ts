import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatriculacionComponent } from './automatriculacion.component';

describe('AutomatriculacionComponent', () => {
  let component: AutomatriculacionComponent;
  let fixture: ComponentFixture<AutomatriculacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatriculacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomatriculacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
