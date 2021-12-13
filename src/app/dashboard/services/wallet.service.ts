import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, switchMap } from 'rxjs';
import { BigNumber, ethers } from 'ethers';
import { environments } from '../';

import detectEthereumProvider from '@metamask/detect-provider';


@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private isConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private activeAdress: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.accountListener();
  }

  public async connect() {
    const provider: any = await detectEthereumProvider();
    if (!provider) {
      throw new Error('please install metamask');
    }

    await provider.request({ method: 'eth_requestAccounts' });
  }

  public isConnected(): Observable<boolean> {
    return this.isConnected$.asObservable();
  }

  public getAccount(): Observable<string> {
    return this.activeAdress.asObservable();
  }

  public setAccount(address: string): void {
    this.activeAdress.next(address);
  }

  public resetAddress(): void {
    const { ethereum } = (window as any);
    if (!!ethereum.selectedAddress) {
      this.activeAdress.next(ethereum.selectedAddress);
    } else {
      this.activeAdress.next('');
    }
  }
  
  public getBalance(externalAddress?: string): Observable<BigNumber> {
    const provider = ethers.getDefaultProvider(environments.mainnet);
    if (!!externalAddress) {
      return from(provider.getBalance(externalAddress));
    }

    return this.getAccount()
    .pipe(
      switchMap(address => from(provider.getBalance(address)))
    );
  }

  private async accountListener(): Promise<void> {    
    const { ethereum } = (window as any);
    
    if (!!ethereum.selectedAddress) {
      this.activeAdress.next(ethereum.selectedAddress);
      this.connected();
    } else {
      await ethereum.enable();
      this.activeAdress.next(ethereum.selectedAddress);
      this.connected();
    }
    
    ethereum.on('accountsChanged', (accounts: any[]) => {
      if (accounts.length == 0) {
        this.activeAdress.next('');
        this.disconnected();
      } else {
        this.activeAdress.next(accounts[0]);
        this.connected();
      }
    });    
  }

  private connected(): void {
    this.isConnected$.next(true);
  }

  private disconnected(): void {
    this.isConnected$.next(false);
  }
}
