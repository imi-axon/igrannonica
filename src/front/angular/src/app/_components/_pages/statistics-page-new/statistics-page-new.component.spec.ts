import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsPageNewComponent } from './statistics-page-new.component';

describe('StatisticsPageNewComponent', () => {
  let component: StatisticsPageNewComponent;
  let fixture: ComponentFixture<StatisticsPageNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsPageNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsPageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
