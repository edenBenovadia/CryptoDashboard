import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { EtherStateManagerService } from '../services/ether-state-manager.service';
import { ethers } from 'ethers';
import { WalletService } from '../services/wallet.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'balance-title',
  templateUrl: './balance-title.component.html',
  styleUrls: ['./balance-title.component.less']
})
export class BalanceTitleComponent implements OnInit, OnDestroy {

  public balanceInEth: string;
  public readonly currency: string = ' eth';

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
        this.balanceInEth = '0' + this.currency;
      } 

      this.cd.detectChanges();
    });
  }

  private async setBalance(): Promise<void> {
    this.wallet.getBalance()
    .pipe(takeUntil(this.destroy$))
    .subscribe((balance) =>
      this.balanceInEth = ethers.utils.formatEther(balance) + this.currency
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
      