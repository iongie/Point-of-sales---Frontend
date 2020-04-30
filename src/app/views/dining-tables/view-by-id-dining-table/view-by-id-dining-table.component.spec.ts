import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByIdDiningTableComponent } from './view-by-id-dining-table.component';

describe('ViewByIdDiningTableComponent', () => {
  let component: ViewByIdDiningTableComponent;
  let fixture: ComponentFixture<ViewByIdDiningTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByIdDiningTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByIdDiningTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
