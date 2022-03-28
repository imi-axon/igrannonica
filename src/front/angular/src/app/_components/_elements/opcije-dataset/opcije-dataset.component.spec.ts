import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcijeDatasetComponent } from './opcije-dataset.component';

describe('OpcijeDatasetComponent', () => {
  let component: OpcijeDatasetComponent;
  let fixture: ComponentFixture<OpcijeDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcijeDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcijeDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
