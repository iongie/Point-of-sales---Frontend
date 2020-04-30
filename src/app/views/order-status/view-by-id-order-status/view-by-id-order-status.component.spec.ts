import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByIdOrderStatusComponent } from './view-by-id-order-status.component';

describe('ViewByIdOrderStatusComponent', () => {
  let component: ViewByIdOrderStatusComponent;
  let fixture: ComponentFixture<ViewByIdOrderStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByIdOrderStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByIdOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
