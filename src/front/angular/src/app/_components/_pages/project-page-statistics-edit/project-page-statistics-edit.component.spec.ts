import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPageStatisticsEditComponent } from './project-page-statistics-edit.component';

describe('ProjectPageStatisticsEditComponent', () => {
  let component: ProjectPageStatisticsEditComponent;
  let fixture: ComponentFixture<ProjectPageStatisticsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPageStatisticsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPageStatisticsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
