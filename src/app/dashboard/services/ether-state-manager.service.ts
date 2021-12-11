import { Injectable } from '@angular/core';
import { bufferCount, concatMap, from, map, Observable, of, skip, switchMap, tap } from 'rxjs';

import { EtherScanHttpService } from './ether-scan-http.service';
import { WalletService } from './wallet.service';
import { ComponentStore } from '@ngrx/component-store';
import { Token, TokenState } from '../';
import { combineLatest } from 'rxjs';
import { ethers } from 'ethers';

const batchSize = 3;
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

  readonly loadTokens = this.effect((tokens$: Observable<string[]>) => {
    return from(tokens$)
    .pipe(
      switchMap(tokens => from(tokens)),
      bufferCount(batchSize),
      concatMap((batch) => {
          const calls: Observable<Token>[] = [];
          batch.forEach(tokenAddressInBatch => calls.push(this.etherScanHttpService.getToken(tokenAddressInBatch)));
          return combineLatest(calls)
      }),
      tap((tokens) => {
        //upsertTokens to have partial data until balances are back from BE
        this.upsertTokens(tokens)

        //load user holdings for each token
        this.loadHoldings(tokens);

        //load price in dollars for each token
        this.loadTokenPriceDollars(tokens);    
      }),
    );
  });

  private readonly loadHoldings = this.effect((tokens$: Observable<Token[]>) => {
      return combineLatest([this.wallet.getAccount(), tokens$])
      .pipe(
        concatMap(([activeAddress, tokens]) => {
          const networkCalls: Observable<Token>[] = [];

          // create array of http networkCalls
          tokens.forEach(token => 
            networkCalls.push(
              this.etherScanHttpService
              .getUserBalanceForToken(token.address, activeAddress)
                .pipe(
                  map((balance) => this.assignBalance(token, balance))
                )
            )
          );

          return combineLatest(networkCalls)
        }),
        tap((tokensWithBalances) => {
          this.upsertTokens(tokensWithBalances);
        })
      );
  });

  private readonly loadTokenPriceDollars = this.effect((tokens$: Observable<Token[]>) => {
    return tokens$
    .pipe(
      concatMap((tokens) => {
        // create array of http networkCalls
        return this.etherScanHttpService.getTokensPriceDollars(tokens.map(token => token.symbol), 'USD')
        .pipe(
          map((pricesAndSymbols: any) => {
            return tokens.map(token => this.assignPrices(token, pricesAndSymbols[token.symbol]?.USD))
          })
        )
      }),
      tap((tokensWithBalances) => {
        this.upsertTokens(tokensWithBalances);
      })
    );
});

  readonly upsertTokens = this.updater((state, tokens: Token[]) => {
    const { tokensEntities } = state;
    tokens.forEach(token => {
      const key = token.symbol;
      if (key in tokensEntities) {
        tokensEntities.set(key, Object.assign(tokensEntities.get(key), token));
      } else {
        tokensEntities.set(key, token);
      }
    });

    return <TokenState> {
      ...state,
      tokensEntities: tokensEntities,
    }
  });

  readonly tokens$: Observable<Token[]> = this.select(state => {
    const tokensList: Token[] = [];
    state.tokensEntities.forEach(token => tokensList.push(token));

    return tokensList;
  });
  
  private assignBalance(token: Token, balance: string): Token {
    let formattedBalance = ethers.utils.formatEther(balance);
    const [left, right] = formattedBalance.split('.');
    formattedBalance = left + '.' + right.substring(0, 3);

    return Object.assign(token, <Token> { 
      quantity: formattedBalance,
    });
  }
  
  private assignPrices(token: Token, priceInDollars: string): Token {
    const value: number = Number.parseFloat(priceInDollars);

    return Object.assign(token, { 
      priceInDollars: value,
    });
  }
  
  // private assignPrices(token: Token, priceInDollars: string): Token {
  //   const value: number = Number.parseFloat(priceInDollars);
  //   let totalValueInDollars: number = 0;

  //   if(!!token.quantity) {
  //     totalValueInDollars = Math.round(Number.parseFloat(token.quantity) * value);
  //   }

  //   return Object.assign(token, { 
  //     priceInDollars: value,
  //     ...(!!totalValueInDollars && {totalValueInDollars: totalValueInDollars}),
  //   });
  // }

} 