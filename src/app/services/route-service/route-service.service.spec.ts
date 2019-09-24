import { TestBed } from '@angular/core/testing';

import { RouteServiceService } from './route-service.service';

describe('RouteServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteServiceService = TestBed.get(RouteServiceService);
    expect(service).toBeTruthy();
  });
});
