import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfEmailAspiranteComponent } from './conf-email-aspirante.component';

describe('ConfEmailAspiranteComponent', () => {
  let component: ConfEmailAspiranteComponent;
  let fixture: ComponentFixture<ConfEmailAspiranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfEmailAspiranteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfEmailAspiranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
