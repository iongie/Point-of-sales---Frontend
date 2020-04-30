import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByIdProductCategoryComponent } from './view-by-id-product-category.component';

describe('ViewByIdProductCategoryComponent', () => {
  let component: ViewByIdProductCategoryComponent;
  let fixture: ComponentFixture<ViewByIdProductCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByIdProductCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByIdProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
