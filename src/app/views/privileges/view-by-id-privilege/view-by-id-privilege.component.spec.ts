import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByIdPrivilegeComponent } from './view-by-id-privilege.component';

describe('ViewByIdPrivilegeComponent', () => {
  let component: ViewByIdPrivilegeComponent;
  let fixture: ComponentFixture<ViewByIdPrivilegeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewByIdPrivilegeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewByIdPrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
