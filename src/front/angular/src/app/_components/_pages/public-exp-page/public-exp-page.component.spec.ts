import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicExpPageComponent } from './public-exp-page.component';

describe('PublicExpPageComponent', () => {
  let component: PublicExpPageComponent;
  let fixture: ComponentFixture<PublicExpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicExpPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicExpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
