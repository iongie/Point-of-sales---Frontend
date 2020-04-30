import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByIdProductComponent } from './view-by-id-product.component';

describe('ViewByIdProductComponent', () => {
  let component: ViewByIdProductComponent;
  let fixture: ComponentFixture<ViewByIdProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByIdProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByIdProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
