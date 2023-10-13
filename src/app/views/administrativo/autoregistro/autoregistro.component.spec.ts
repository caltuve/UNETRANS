import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoregistroComponent } from './autoregistro.component';

describe('AutoregistroComponent', () => {
  let component: AutoregistroComponent;
  let fixture: ComponentFixture<AutoregistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoregistroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoregistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
