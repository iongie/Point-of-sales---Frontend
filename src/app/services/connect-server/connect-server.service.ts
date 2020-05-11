import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import io from 'socket.io-client';
import { Subject, of, BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ConnectServerService implements OnDestroy {
  socket = io(environment.url);

  _datalocal;
  
  private subs = new Subject();
  private response = new Subject<any>();
  private responseTwo = new Subject<any>();
  private responseThree = new Subject<any>();
  private changeData = new Subject<any>();
  private profile = new Subject<any>();
  private filterData = new Subject<any>();
  private newOrder = new Subject<any>();
  private forBillAfterOrder =  new Subject<any>();
  private dataOfLocal = new BehaviorSubject<any>([]);
  forBillAfterOrder$ = this.forBillAfterOrder.asObservable();
  dataOfLocal$ = this.dataOfLocal.asObservable();
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
  constructor(
    private toastr: ToastrService
  ) { }

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
      this.toast(sendData);
    });
  }

  toast(sendData){
    this.socket.on(sendData.response, res => {
      console.log(res.insertId);
      this.forBillAfterOrder.next(res.insertId);
      if(res.response = 'success') {
        this.toastr.success(res.message, 'Done', {
          timeOut: 1000,
          positionClass: 'toast-bottom-center'
        });
      } else {
        this.toastr.error(res.message, 'Error', {
          timeOut: 1000,
          positionClass: 'toast-bottom-center'
        });
      }
    })
  }

  responseBillAfterOrder(data) {
    
  }

  responseRead(data){
    this.response.next(data);  
  }

  changeDataRead(data){
    this.changeData.next(data);
  }

  localOfData(dataOfLocal) {
    this.dataOfLocal.next(dataOfLocal);
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

  saveOfflineData(key, value) {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify(key), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    let encryptedValue = CryptoJS.AES.encrypt(
    JSON.stringify(value), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    localStorage.setItem(encryptedKey.toString(), encryptedValue.toString());
  }

  saveOnlineOfOfflineData(key) {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify(key), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const localStorageKeyLocalStorage = localStorage.getItem(encryptedKey.toString());
    if (localStorageKeyLocalStorage !== null) {
      let decryptedValue = CryptoJS.AES.decrypt(
      localStorage.getItem(localStorageKeyLocalStorage), this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const dataOfLocal = JSON.parse(decryptedValue.toString(CryptoJS.enc.Utf8));
      if(dataOfLocal.action.upload == true) {
        if(dataOfLocal.upload.base64 !== undefined){
          const byteString  = atob( dataOfLocal.upload.base64.split(',')[1]);
          var arrayBuffer = new ArrayBuffer(byteString.length);
          const uint8Array = new Uint8Array(byteString.length);
          const typeBuffer = dataOfLocal.upload.base64.split(';')[0].split(':')[1];
          for (var i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
          }
          const selectedFile =  new Blob([uint8Array], {type: typeBuffer});
          dataOfLocal.upload.selectedFile = selectedFile;
        }
      }
      const data = localStorage.getItem('RYxkwzofb7Dqr1oV2EYBNw==');
      this.socket = io(environment.url+'/entry', {
        forceNew: true,
        query: {
          token: `Barrier ${data}`
        }
      });
      of(this.socket.emit('entry-data', dataOfLocal)).pipe(takeUntil(this.subs)).subscribe(() => {
        this.socket.on(dataOfLocal.read.response, res => {
          this.responseRead(res);
        });
      });
    }
  }
}
