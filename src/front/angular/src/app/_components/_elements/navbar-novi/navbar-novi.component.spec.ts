import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarNoviComponent } from './navbar-novi.component';

describe('NavbarNoviComponent', () => {
  let component: NavbarNoviComponent;
  let fixture: ComponentFixture<NavbarNoviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarNoviComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarNoviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
