import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKitchenTypeComponent } from './add-kitchen-type.component';

describe('AddKitchenTypeComponent', () => {
  let component: AddKitchenTypeComponent;
  let fixture: ComponentFixture<AddKitchenTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddKitchenTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKitchenTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
