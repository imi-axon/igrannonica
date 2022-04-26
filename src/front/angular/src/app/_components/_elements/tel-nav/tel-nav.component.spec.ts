import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelNavComponent } from './tel-nav.component';

describe('TelNavComponent', () => {
  let component: TelNavComponent;
  let fixture: ComponentFixture<TelNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
