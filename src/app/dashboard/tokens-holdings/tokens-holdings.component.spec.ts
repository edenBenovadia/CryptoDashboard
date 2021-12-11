import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokensHoldingsComponent } from './tokens-holdings.component';

describe('TokensHoldingsComponent', () => {
  let component: TokensHoldingsComponent;
  let fixture: ComponentFixture<TokensHoldingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokensHoldingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokensHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
