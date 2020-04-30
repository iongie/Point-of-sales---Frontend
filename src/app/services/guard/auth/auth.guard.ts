import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  tokenCrypto= environment.tokenCrypto;
  constructor(
    private router: Router,
    ) { }

  isLoggednIn() {
    return localStorage.getItem('RYxkwzofb7Dqr1oV2EYBNw==') !== null;
  }

  isRole(role: any[]): boolean {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
    let decryptedKey = CryptoJS.AES.decrypt(
    localStorage.getItem('72OZpKxzDxwoxgst88vykQ=='), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const currentUser = JSON.parse(decryptedKey.toString(CryptoJS.enc.Utf8));
    return role.includes(currentUser[0].privilegeId);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.isLoggednIn()) {
        const allowedRoles = next.data.role;
        const isAuthorized = this.isRole(allowedRoles);
        if (!isAuthorized) {
          return false;
        }
        return true;
      }else {
        this.router.navigate(['login']);
        return false;
      }
  }
  
}
