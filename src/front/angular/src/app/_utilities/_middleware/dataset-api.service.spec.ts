import { TestBed } from '@angular/core/testing';

import { DatasetApiService } from './dataset-api.service';

describe('DatasetApiService', () => {
  let service: DatasetApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
