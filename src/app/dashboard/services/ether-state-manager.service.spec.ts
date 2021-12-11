import { TestBed } from '@angular/core/testing';
import { EtherStateManagerService } from './ether-state-manager.service';

describe('EtherStateManagerService', () => {
  let service: EtherStateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtherStateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
