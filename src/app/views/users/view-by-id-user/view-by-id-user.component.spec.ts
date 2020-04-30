import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByIdUserComponent } from './view-by-id-user.component';

describe('ViewByIdUserComponent', () => {
  let component: ViewByIdUserComponent;
  let fixture: ComponentFixture<ViewByIdUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByIdUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByIdUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
