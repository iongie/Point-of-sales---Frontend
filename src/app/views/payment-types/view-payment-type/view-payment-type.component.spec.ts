import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaymentTypeComponent } from './view-payment-type.component';

describe('ViewPaymentTypeComponent', () => {
  let component: ViewPaymentTypeComponent;
  let fixture: ComponentFixture<ViewPaymentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPaymentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
