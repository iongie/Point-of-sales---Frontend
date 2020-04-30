import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiningTableComponent } from './add-dining-table.component';

describe('AddDiningTableComponent', () => {
  let component: AddDiningTableComponent;
  let fixture: ComponentFixture<AddDiningTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDiningTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiningTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
