import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyInformationGeneralComponent } from './notify-information-general.component';

describe('NotifyInformationGeneralComponent', () => {
  let component: NotifyInformationGeneralComponent;
  let fixture: ComponentFixture<NotifyInformationGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifyInformationGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifyInformationGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
