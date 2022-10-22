import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllItemPageComponent } from './all-item-page.component';

describe('AllItemPageComponent', () => {
  let component: AllItemPageComponent;
  let fixture: ComponentFixture<AllItemPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllItemPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
