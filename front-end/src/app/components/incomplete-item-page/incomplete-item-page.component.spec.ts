import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteItemPageComponent } from './incomplete-item-page.component';

describe('IncompleteItemPageComponent', () => {
  let component: IncompleteItemPageComponent;
  let fixture: ComponentFixture<IncompleteItemPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncompleteItemPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncompleteItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
