import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DugmeComponent } from './dugme.component';

describe('DugmeComponent', () => {
  let component: DugmeComponent;
  let fixture: ComponentFixture<DugmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DugmeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DugmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
