import {Component, OnInit} from '@angular/core';
import { nav } from '../../_nav';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems: any;
  tokenCrypto= environment.tokenCrypto;

  constructor(
    private swUpdate: SwUpdate
  ) {

  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnInit() {
    this.navigation();
    
  }

  checkSW() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if(confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }  
  }

  navigation() {
    let navItem =  nav.map(navi => {
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
      const privilege = currentUser[0].privilegeId;
      let view = navi.role.includes(privilege);      
      if (view){
        return navi;
      }
      return false;
    });

    let navItemNoUndifined = navItem.filter(data => {
      return data !== false;
    })
    this.navItems = navItemNoUndifined; 
  }
}
