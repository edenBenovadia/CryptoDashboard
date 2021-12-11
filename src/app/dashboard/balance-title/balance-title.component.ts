import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EtherStateManagerService } from '../services/ether-state-manager.service';
import { ethers } from 'ethers';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'balance-title',
  templateUrl: './balance-title.component.html',
  styleUrls: ['./balance-title.component.less']
})
export class BalanceTitleComponent implements OnInit {

  public balanceInEth: string;
  public readonly currency: string = ' eth';

  constructor(
    public readonly etherState: EtherStateManagerService,
    public readonly wallet: WalletService,
    public readonly cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.wallet.isConnected()
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
    this.wallet.getBalance().subscribe((balance) =>
      this.balanceInEth = ethers.utils.formatEther(balance) + this.currency
    );
  }
}
      