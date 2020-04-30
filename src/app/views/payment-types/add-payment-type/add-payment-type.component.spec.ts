import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentTypeComponent } from './add-payment-type.component';

describe('AddPaymentTypeComponent', () => {
  let component: AddPaymentTypeComponent;
  let fixture: ComponentFixture<AddPaymentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaymentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
