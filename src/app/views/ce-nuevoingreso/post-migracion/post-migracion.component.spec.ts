import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMigracionComponent } from './post-migracion.component';

describe('PostMigracionComponent', () => {
  let component: PostMigracionComponent;
  let fixture: ComponentFixture<PostMigracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostMigracionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostMigracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
