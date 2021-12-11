import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EtherStateManagerService } from '../services/ether-state-manager.service';
import { WalletService } from '../services/wallet.service';
import { create } from 'ethereum-blockies';
import { skipWhile } from 'rxjs';

@Component({
  selector: 'address-title',
  templateUrl: './address-title.component.html',
  styleUrls: ['./address-title.component.less'],
})
export class AddressTitleComponent implements OnInit, AfterViewInit {
  public address: string;
  @ViewChild('iconContainer') iconContainer: ElementRef;

  constructor(
    public readonly etherState: EtherStateManagerService,
    public readonly wallet: WalletService,
    public readonly cd: ChangeDetectorRef,
    private renderer: Renderer2,
    ) {
      create();
    }

  public ngOnInit(): void {
    this.wallet.getAccount()
    .subscribe((address) => {
        this.address = address;
        this.cd.detectChanges();
      })
    }
    
  public ngAfterViewInit(): void {
      this.wallet.getAccount()
      .pipe(skipWhile(a => !a))
      .subscribe((address) => {
        const icon = create({
          seed: address,
          size: 7,
          scale: 3,
        });

        const existedCanvas = this.iconContainer.nativeElement.querySelector('canvas');
        if (!!existedCanvas) {
          this.renderer.removeChild(this.iconContainer.nativeElement, existedCanvas);
        }

        this.renderer.appendChild(this.iconContainer.nativeElement, icon);
        const canvas = this.iconContainer.nativeElement.querySelector('canvas');
        this.renderer.addClass(canvas, 'avatar');
        this.cd.markForCheck();
    });
  }
}
