import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevFotosComponent } from './rev-fotos.component';

describe('RevFotosComponent', () => {
  let component: RevFotosComponent;
  let fixture: ComponentFixture<RevFotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevFotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
