import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable, Subscription, fromEvent } from 'rxjs';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
import { take, takeUntil } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bill-after-order',
  templateUrl: './bill-after-order.component.html',
  styleUrls: ['./bill-after-order.component.css']
})
export class BillAfterOrderComponent implements OnInit, OnDestroy {
  private subs = new Subject<any>();

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  tokenCrypto= environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);

  printData: any = {};
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    public connectServ: ConnectServerService,
  ) { }

  ngOnInit(): void {
    this.billAfterOrder();
    this.readHistory();
    this.statusConnection();
    if(navigator.onLine) {
      
    } else if (!navigator.onLine) {
    }
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  statusConnection(){
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      this.billAfterOrder();
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
 
    }));
  }

  billAfterOrder() {
    this.activeRoute.params.pipe(takeUntil(this.subs)).subscribe(params => {
      const id = params.id.toString().replace(/Por21Ld/g, '/');
      let paramsId = CryptoJS.AES.decrypt(
        id, this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      let sendData = {
        numberOfTable: 1,
        action: {
          table: 'read',
          upload: false,
          join: true,
        },
        read: {
          table: "history_profile",
          joinTable: "JOIN history_app ON history_app.historyAppId = history_profile.historyAppId JOIN PROFILE ON PROFILE .profileId = history_profile.profileId JOIN orders ON orders.orderId = history_profile.processId WHERE "+
                      "history_profile.processId = '"+
                      JSON.parse(paramsId)+
                      "'"+
                      " AND history_app.description = "+
                      "'Added Order Menu'",
          response: "response-product"
        }
      };
      this.connectServ.readTwo(sendData)
    });
  }

  readHistory() {
    this.connectServ.responseTwo$.pipe(takeUntil(this.subs)).subscribe(res => {
    this.printData = res.data[0];
    this.printData.orderProduct = JSON.parse(this.printData.orderProduct);
    this.printData.ppn = JSON.parse(this.printData.tax).ppn;
    const subTotal = this.printData.orderProduct.map(x => {
      return x.subTotal;
    });
    this.printData.total = subTotal.reduce((a,b) => {
      return a+b;
    })
     console.log(this.printData);
    })
  }

  printBill(){
    window.print()
  }

}
