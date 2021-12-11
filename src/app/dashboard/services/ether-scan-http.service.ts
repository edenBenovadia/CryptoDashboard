import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Token } from '../';

const EtherScanApiKey = 'S57EI2ZIB9M3FYBYQE4QKJ3CPJ787EYRYZ'
const AlchemyApiKey = 'J5sqlyFi0iTT8YYyRowXN_yDYmy3-0EV'
const CryptoCompareApiKey = '656629db6f3c9e0563185b402dc49b5a42eb1c2321285692fb043d3130e78726'

const AlchemyEndpoint = 'https://eth-mainnet.alchemyapi.io/v2/' + AlchemyApiKey
const EtherScanEndpoint = 'https://api.etherscan.io/api?module=account&action=tokenbalance';
const CryptoCompareEndpoint = 'https://min-api.cryptocompare.com/data/pricemulti';

@Injectable({
  providedIn: 'root'
})
export class EtherScanHttpService {
  
  constructor(private http: HttpClient) { }

  // need to implement chunks loading
  public getUserBalanceForToken(contractsAddresses: string, address: string): Observable<string> {
    const endpoint = EtherScanEndpoint
                      + '&contractaddress=' + contractsAddresses
                      + '&address=' + address
                      + '&tag=latest&apikey=' + EtherScanApiKey

    return this.http.get(endpoint)
    .pipe(
        map((data: any) => <string> data.result),
    );
  }

  public getTokensPriceDollars(tokenSymbols: string[], fiatCurrencySymbol: string) {
    const token = `fsyms=${tokenSymbols.toString()}`;
    const currency = `tsyms=${fiatCurrencySymbol}`;
    const endpoint = `${CryptoCompareEndpoint}?${token}&${currency}&api_key=${CryptoCompareApiKey}`;

    return this.http.get(endpoint)
    .pipe(
      map((result: any) => result)
    );
  }

  public getToken(tokensAddress: string): Observable<Token> {
    const body = {
      jsonrpc:"2.0",
      method:"alchemy_getTokenMetadata",
      params:[tokensAddress],
      id:2,
    }

    return this.http.post(AlchemyEndpoint, body)
    .pipe(
      map((response: any) => {
          const {name, logo, symbol} = response.result;
          return <Token> {
            name: name,
            symbol: symbol,
            address:tokensAddress, 
            icon: logo,
          };
      })
    );
  }
}
