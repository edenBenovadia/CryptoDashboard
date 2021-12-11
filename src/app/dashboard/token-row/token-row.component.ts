import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { Token } from '..';

@Component({
  selector: 'token-row',
  templateUrl: './token-row.component.html',
  styleUrls: ['./token-row.component.less']
})
export class TokenRowComponent implements OnChanges {
  @Input() token: Token;

  constructor(
  ) { }

  ngOnChanges(): void {
    if (!!this.token.quantity && !!this.token.priceInDollars) {
      this.token.totalValueInDollars = Math.round(this.token.priceInDollars * Number.parseFloat(this.token.quantity));
    }
  }
}
