import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeDiningTableComponent } from './customize-dining-table.component';

describe('CustomizeDiningTableComponent', () => {
  let component: CustomizeDiningTableComponent;
  let fixture: ComponentFixture<CustomizeDiningTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeDiningTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeDiningTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
