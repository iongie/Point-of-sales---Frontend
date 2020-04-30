import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByIdPaymentTypeComponent } from './view-by-id-payment-type.component';

describe('ViewByIdPaymentTypeComponent', () => {
  let component: ViewByIdPaymentTypeComponent;
  let fixture: ComponentFixture<ViewByIdPaymentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByIdPaymentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByIdPaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
