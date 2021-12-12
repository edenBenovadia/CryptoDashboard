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
    public readonly etherState: EtherStateManagerService,
    public readonly wallet: WalletService,
    public readonly cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.wallet.isConnected()
    .pipe(takeUntil(this.destroy$))
    .subscribe(async (connected) => {
      if (connected) {
        await this.setBalance();
      } else {
        this.netWorth = '0' + this.currency;
      } 

      this.cd.detectChanges();
    });
  }

  private async setBalance(): Promise<void> {
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
      