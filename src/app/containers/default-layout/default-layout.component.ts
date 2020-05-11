import {Component, OnInit, OnDestroy} from '@angular/core';
import { nav } from '../../_nav';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { SwUpdate } from '@angular/service-worker';
import { Observable, Subscription, fromEvent, of } from 'rxjs';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public sidebarMinimized = false;
  public navItems: any;
  tokenCrypto= environment.tokenCrypto;

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  constructor(
    private swUpdate: SwUpdate,
    private connectServerServ: ConnectServerService,
    private router: Router
  ) {

  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnInit() {
    this.navigation();
    this.statusConnection();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  statusConnection() {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      console.log('Online...');

      const keyCUD = [
        'add_dining_table',
        'update_dining_table',
        'delete_dining_table',
        'add_kitchen_type',
        'update_kitchen_type',
        'delete_kitchen_type',
        'add_order_status',
        'update_order_status',
        'delete_order_status',
        'add_payment_type',
        'update_payment_type',
        'delete_payment_type',
        'add_privilege',
        'update_privilege',
        'delete_privilege',
        'add_product_category',
        'update_product_category',
        'delete_product_category',
        'add_product',
        'update_product',
        'delete_product',
        'add_user',
        'update_user',
        'delete_user',
        'add_order'
      ]

      keyCUD.map(x => {
        this.connectServerServ.saveOnlineOfOfflineData(x);
      })

    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      console.log('Offline...');
    }));
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

  logout(){
    of(localStorage.clear()).toPromise().then(()=> {
      this.router.navigate(['login']);
    })
  }
}
