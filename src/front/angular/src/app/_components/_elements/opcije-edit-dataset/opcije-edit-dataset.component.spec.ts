import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcijeEditDatasetComponent } from './opcije-edit-dataset.component';

describe('OpcijeEditDatasetComponent', () => {
  let component: OpcijeEditDatasetComponent;
  let fixture: ComponentFixture<OpcijeEditDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcijeEditDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcijeEditDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
