import { Injectable, OnDestroy } from '@angular/core';
import io from 'socket.io-client';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {
  socket;
  private subs: Subject<void> = new Subject();
  tokenCrypto= environment.tokenCrypto;
  constructor(
    private router: Router,
  ) { }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
  }

  loginData(sendData) {
    this.socket = io(environment.url+'/login');
    of(this.socket.emit('login-data', sendData)).pipe(takeUntil(this.subs)).subscribe(() => {
      this.socket.on(sendData.readById.response, res => {
        if(res.response = "success") {
          let _key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
          let _iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
          let encryptedResDataKeyAccessToken = CryptoJS.AES.encrypt(
          JSON.stringify('access_token'), _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
          let encryptedResDataValue = CryptoJS.AES.encrypt(
          JSON.stringify(res.data), _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
          let encryptedResDataKey = CryptoJS.AES.encrypt(
          JSON.stringify('data account'), _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
          localStorage.setItem(encryptedResDataKeyAccessToken.toString(), res.accessToken);
          localStorage.setItem(encryptedResDataKey.toString(), encryptedResDataValue.toString());
          this.router.navigate(['/dashboard']);
        }
      })
    })
  }
}
