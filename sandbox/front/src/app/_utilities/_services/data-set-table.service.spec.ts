import { TestBed } from '@angular/core/testing';

import { DataSetTableService } from './data-set-table.service';

describe('DataSetTableService', () => {
  let service: DataSetTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSetTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
