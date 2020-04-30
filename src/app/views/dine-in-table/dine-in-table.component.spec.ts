import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DineInTableComponent } from './dine-in-table.component';

describe('DineInTableComponent', () => {
  let component: DineInTableComponent;
  let fixture: ComponentFixture<DineInTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DineInTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DineInTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
