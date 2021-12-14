import { TestBed } from '@angular/core/testing';
import { TokensStore } from './tokens.store';

describe('TokensStore', () => {
  let service: TokensStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokensStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
