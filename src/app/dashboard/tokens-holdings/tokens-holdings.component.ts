import { Token } from '../';
import { Component, Input, OnInit } from '@angular/core';
import { EtherStateManagerService } from '../services/ether-state-manager.service';

@Component({
  selector: 'tokens-holdings',
  templateUrl: './tokens-holdings.component.html',
  styleUrls: ['./tokens-holdings.component.less']
})
export class TokensHoldingsComponent implements OnInit {
  @Input() tokens: Token[]  = [];

  constructor(private readonly tokensStore: EtherStateManagerService) { }

  public ngOnInit(): void {
    this.tokensStore.tokens$
    .subscribe(tokens => {
      this.tokens = tokens;
    });
  }

}
