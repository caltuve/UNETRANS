import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadCurricularComponent } from './unidad-curricular.component';

describe('UnidadCurricularComponent', () => {
  let component: UnidadCurricularComponent;
  let fixture: ComponentFixture<UnidadCurricularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadCurricularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadCurricularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
