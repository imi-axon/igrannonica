import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NnPageComponent } from './nn-page.component';

describe('NnPageComponent', () => {
  let component: NnPageComponent;
  let fixture: ComponentFixture<NnPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NnPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
