import { TestBed } from '@angular/core/testing';

import { ConnectServerService } from './connect-server.service';

describe('ConnectServerService', () => {
  let service: ConnectServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
