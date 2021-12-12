import { Token } from '../';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EtherStateManagerService } from '../services/ether-state-manager.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'tokens-holdings',
  templateUrl: './tokens-holdings.component.html',
  styleUrls: ['./tokens-holdings.component.less']
})
export class TokensHoldingsComponent implements OnInit, OnDestroy {
  @Input() tokens: Token[]  = [];

  private destroy$: Subject<void> = new Subject()

  constructor(
    private readonly tokensStore: EtherStateManagerService,
    private readonly cd: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.tokensStore.tokens$
    .pipe(takeUntil(this.destroy$))
    .subscribe(tokens => {
      this.tokens = tokens;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
