import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiningTableComponent } from './view-dining-table.component';

describe('ViewDiningTableComponent', () => {
  let component: ViewDiningTableComponent;
  let fixture: ComponentFixture<ViewDiningTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiningTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiningTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
