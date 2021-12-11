import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs';
import { tokenAddresses } from '..';
import { EtherStateManagerService } from '../services/ether-state-manager.service';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.less']
})
export class DashboardContainerComponent implements OnInit {

  public connection: string;
  public changedAddress: string = '';

  constructor(
    private wallet: WalletService,
    private readonly cd: ChangeDetectorRef,
    private readonly tokensStore: EtherStateManagerService,
  ) { }

  ngOnInit(): void {
    this.tokensStore.loadTokens(tokenAddresses);
    this.wallet.isConnected()
    .subscribe(connected => {
      if (connected) {
        this.connection = 'Connected';
      } else {
        this.connection = 'Connect to metamask';
      }

      this.cd.detectChanges();
    });

    this.wallet.getAccount()
    .pipe(
      distinctUntilChanged()
    ).subscribe(() => 
      this.tokensStore.loadTokens(tokenAddresses)
    );
  }
  
  public changeAddress(event: any) {
    if (!!event) {
      event.preventDefault();
    }

    if (!!event.target.value) {
      this.changedAddress = event.target.value;
      this.wallet.setAccount(event.target.value);
    } 
  }

  public resetAddress() {
    this.changedAddress = '';
    this.wallet.resetAddress();
  }

  public connect(): void {
    this.wallet.connect();
  }
}
