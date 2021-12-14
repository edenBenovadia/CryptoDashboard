import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EtherStateManagerService } from '../services/ether-state-manager.service';
import { WalletService } from '../services/wallet.service';
import { create } from 'ethereum-blockies';
import { skipWhile, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'address-title',
  templateUrl: './address-title.component.html',
  styleUrls: ['./address-title.component.less'],
})
export class AddressTitleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('iconContainer') iconContainer: ElementRef;
  public address: string;
  public hasError: boolean;
  
  private destroy$: Subject<void> = new Subject()

  constructor(
    private readonly tokensStore: EtherStateManagerService,
    private readonly wallet: WalletService,
    private readonly cd: ChangeDetectorRef,
    private renderer: Renderer2,
    ) {
      create();
    }

  public ngOnInit(): void {
    this.wallet.getAccount()
    .pipe(takeUntil(this.destroy$))
    .subscribe((address) => {
        this.address = address;
        this.cd.detectChanges();
    });

    this.tokensStore.hasError$
    .pipe(
      takeUntil(this.destroy$)
    ).subscribe((hasError) => {
      this.hasError = hasError;
    });
  }
    
  public ngAfterViewInit(): void {
      this.wallet.getAccount()
      .pipe(
        skipWhile(a => !a),
        takeUntil(this.destroy$),
      )
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
