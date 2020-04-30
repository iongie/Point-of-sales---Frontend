import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByIdKitchenTypeComponent } from './view-by-id-kitchen-type.component';

describe('ViewByIdKitchenTypeComponent', () => {
  let component: ViewByIdKitchenTypeComponent;
  let fixture: ComponentFixture<ViewByIdKitchenTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByIdKitchenTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByIdKitchenTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
