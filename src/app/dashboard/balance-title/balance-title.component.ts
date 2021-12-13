import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { EtherStateManagerService } from '../services/ether-state-manager.service';
import { WalletService } from '../services/wallet.service';
import { map, Subject, takeUntil } from 'rxjs';
import { Token } from '..';
import { roundNumber } from '../utils';

@Component({
  selector: 'balance-title',
  templateUrl: './balance-title.component.html',
  styleUrls: ['./balance-title.component.less']
})
export class BalanceTitleComponent implements OnInit, OnDestroy {

  public netWorth: string;
  public readonly currency: string = '$';

  private destroy$: Subject<void> = new Subject()

  constructor(
    private readonly etherState: EtherStateManagerService,
    private readonly cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.setBalance();
  }

  private setBalance(): void {
    this.etherState.tokens$
    .pipe(
      map((tokens: Token[]) => tokens.reduce(this.add, 0)),
      takeUntil(this.destroy$)
    )
    .subscribe((netWorth) => {
      this.netWorth = roundNumber(netWorth).toString() + this.currency;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private add(accumulator: number, token: Token) {
    if (!!token.totalValueInDollars) {
      return accumulator + token.totalValueInDollars;
    }

    return accumulator;
  }
}
      