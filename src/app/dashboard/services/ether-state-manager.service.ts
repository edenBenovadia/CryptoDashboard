import { Injectable } from '@angular/core';
import { filter, Observable, switchMap, tap } from 'rxjs';

import { EtherScanHttpService } from './ether-scan-http.service';
import { WalletService } from './wallet.service';
import { ComponentStore } from '@ngrx/component-store';
import { Token, TokenState } from '../';

const EmptyState: TokenState = {
  tokensEntities: new Map<string, Token>(),
  tokensList: [],
}

@Injectable({
  providedIn: 'root'
})
export class EtherStateManagerService extends ComponentStore<TokenState> {
  constructor(
    private etherScanHttpService: EtherScanHttpService,
    private wallet: WalletService,
  ) {
    super(EmptyState);
  }

  readonly loadTokens = this.effect(() => {
    return this.wallet.getAccount()
    .pipe(
      filter(address => !!address),
      switchMap((address) => {
        return this.etherScanHttpService.getBalanceForAddress(address);
      }),
      tap((tokens) => {
        this.addTokens(tokens)
      }),
    );
  });

  readonly resetTokens = this.effect((reset$) => {
    return reset$
    .pipe(
      //only if address if empty
      tap(() => {
        this.clearTokens();
      }),
    );
  });

  readonly upsertTokens = this.updater((state, tokens: Token[]) => {
    const { tokensEntities } = state;
    tokens.forEach(token => {
      const key = token.symbol;
      if (tokensEntities.has(key)) {
        const updatedToken = Object.assign(tokensEntities.get(key), token);
        tokensEntities.set(key, updatedToken);
      } else {
        tokensEntities.set(key, token);
      }
    });

    return <TokenState> {
      ...state,
      tokensEntities: tokensEntities,
    }
  });

  readonly clearTokens = this.updater((state) => {
    return <TokenState> {
      ...state,
      tokensEntities: new Map<string, Token>(),
    }
  });

  readonly addTokens = this.updater((state, tokens: Token[]) => {
    const tokensMap = new Map<string, Token>()
    tokens.forEach(token => {
      const key = token.symbol;
      tokensMap.set(key, token);
    });

    return <TokenState> {
      ...state,
      tokensEntities: tokensMap,
    }
  });

  readonly tokens$: Observable<Token[]> = this.select(state => {
    const tokensList: Token[] = [];
    state.tokensEntities.forEach(token => tokensList.push(token));

    return tokensList;
  });
} 