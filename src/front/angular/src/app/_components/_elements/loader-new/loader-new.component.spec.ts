import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderNewComponent } from './loader-new.component';

describe('LoaderNewComponent', () => {
  let component: LoaderNewComponent;
  let fixture: ComponentFixture<LoaderNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
