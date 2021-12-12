import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Token } from '../';
import { roundNumber } from '../utils';

const CovaAPIKey = 'ckey_ffa8a0f9ed3841bdbecf793b28b'
const ConvalenthqueEndpoint = 'https://api.covalenthq.com/v1/1/address/'

@Injectable({
  providedIn: 'root'
})
export class EtherScanHttpService {
  
  constructor(private http: HttpClient) { }

  public getBalanceForAddress(address: string): Observable<Token[]> {
    const endpoint = `${ConvalenthqueEndpoint}${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${CovaAPIKey}`;
    return this.http.get(endpoint)
    .pipe(
      map((result: any) => {
        return result.data.items
        .map((item: any) => {
         return <Token> {
            address: item.contract_address,
            name: item.contract_name,
            symbol: item.contract_ticker_symbol,
            icon: item.logo_url,
            priceInDollars: roundNumber(item.quote_rate),
            totalValueInDollars: roundNumber(item.quote),
            quantity: roundNumber((item.quote / item.quote_rate)).toString(),
          }
        })
        .filter((token: Token) => !!token.icon && !!token.priceInDollars && token.symbol)
      })
    );
  }
}