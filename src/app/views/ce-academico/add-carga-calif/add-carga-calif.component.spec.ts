import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCargaCalifComponent } from './add-carga-calif.component';

describe('AddCargaCalifComponent', () => {
  let component: AddCargaCalifComponent;
  let fixture: ComponentFixture<AddCargaCalifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCargaCalifComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCargaCalifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
