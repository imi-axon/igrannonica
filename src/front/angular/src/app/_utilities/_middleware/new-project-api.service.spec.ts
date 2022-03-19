import { TestBed } from '@angular/core/testing';

import { NewProjectApiService } from './new-project-api.service';

describe('NewProjectApiService', () => {
  let service: NewProjectApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewProjectApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
