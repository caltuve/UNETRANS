import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutopostuladosComponent } from './autopostulados.component';

describe('AutopostuladosComponent', () => {
  let component: AutopostuladosComponent;
  let fixture: ComponentFixture<AutopostuladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutopostuladosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutopostuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
