import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteItemPageComponent } from './complete-item-page.component';

describe('CompleteItemPageComponent', () => {
  let component: CompleteItemPageComponent;
  let fixture: ComponentFixture<CompleteItemPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteItemPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
