import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAfterOrderComponent } from './bill-after-order.component';

describe('BillAfterOrderComponent', () => {
  let component: BillAfterOrderComponent;
  let fixture: ComponentFixture<BillAfterOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillAfterOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAfterOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
