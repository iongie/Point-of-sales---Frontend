import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewKitchenTypeComponent } from './view-kitchen-type.component';

describe('ViewKitchenTypeComponent', () => {
  let component: ViewKitchenTypeComponent;
  let fixture: ComponentFixture<ViewKitchenTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewKitchenTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewKitchenTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
