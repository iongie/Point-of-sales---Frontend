import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import io from 'socket.io-client';
import { Subject, of } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectServerService implements OnDestroy {
  socket = io(environment.url);
  
  private subs = new Subject();
  private response = new Subject<any>();
  private responseTwo = new Subject<any>();
  private responseThree = new Subject<any>();
  private changeData = new Subject<any>();
  private profile = new Subject<any>();
  private filterData = new Subject<any>();
  private newOrder = new Subject<any>();
  response$ = this.response.asObservable();
  responseTwo$ = this.responseTwo.asObservable();
  responseThree$ = this.responseThree.asObservable();
  changeData$ = this.changeData.asObservable();
  profile$ = this.profile.asObservable();
  filterData$ = this.filterData.asObservable();
  newOrder$ = this.newOrder.asObservable();
  tokenCrypto= environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  constructor() { }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
  }


  read(sendData) {
    const data = localStorage.getItem('RYxkwzofb7Dqr1oV2EYBNw==');
    this.socket = io(environment.url+'/entry', {
      forceNew: true,
      query: {
        token: `Barrier ${data}`
      }
    });
    of(this.socket.emit('entry-data', sendData)).pipe(takeUntil(this.subs)).subscribe(() => {
      this.socket.on(sendData.read.response, res => {
        this.responseRead(res);
      })
    });
  }

  responseRead(data){
    this.response.next(data);  
  }

  changeDataRead(data){
    this.changeData.next(data);
  }

  filterDataEvent(data) {
    this.filterData.next(data);
  }
  

  readDataProfile() {
    const dataLocal = localStorage.getItem('72OZpKxzDxwoxgst88vykQ==');
    let decrypt = CryptoJS.AES.decrypt(
      dataLocal, this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    this.responseReadDataProfile(JSON.parse(decrypt))
  }

  responseReadDataProfile(data){
    this.profile.next(data);
  }

  readTwo(sendData) {
    const data = localStorage.getItem('RYxkwzofb7Dqr1oV2EYBNw==');
    this.socket = io(environment.url+'/entry', {
      forceNew: true,
      query: {
        token: `Barrier ${data}`
      }
    });
    of(this.socket.emit('entry-data', sendData)).pipe(takeUntil(this.subs)).subscribe(() => {
      this.socket.on(sendData.read.response, res => {
        this.responseReadTwo(res);
      })
    });
  }

  responseReadTwo(data){
    this.responseTwo.next(data);
  }

  readThree(sendData) {
    const data = localStorage.getItem('RYxkwzofb7Dqr1oV2EYBNw==');
    this.socket = io(environment.url+'/entry', {
      forceNew: true,
      query: {
        token: `Barrier ${data}`
      }
    });
    of(this.socket.emit('entry-data', sendData)).pipe(takeUntil(this.subs)).subscribe(() => {
      this.socket.on(sendData.read.response, res => {
        this.responseReadThree(res);
      })
    });
  }

  responseReadThree(data){
    this.responseThree.next(data);
  }

  responseNewOrder(data) {
    this.newOrder.next(data);
  }
}
