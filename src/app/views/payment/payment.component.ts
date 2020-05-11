import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, of, Observable, Subscription, fromEvent } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil, take } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  orders: any = [];
  paymentType: any = [];
  totalOrder:any = {};
  amount:any = {};
  statusOrder: any = {};
  paymentTypeId: any = {};
  paymentTypeIndex: any = {};
  dineInTableOrder: any = {};
  ref: any = {};
  orderNumber: any = {};
  tax: any = {};
  dateHistory = new Date();
  private subs = new Subject<any>();

  tokenCrypto= environment.tokenCrypto;
  imgURL = environment.image;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  constructor(
    public connectServ: ConnectServerService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.newOrder();
    this.statusConnection();
    if(navigator.onLine) {
      this.dataPaymentType();
      this.readPaymentType();
      this.dataHistory();
      this.readHistory();
    } else if (!navigator.onLine) {
      this.readOfflineDataOrderPaymentType();
      this.readOfflineDataOrderHistory();
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
      this.dataPaymentType();
      this.readPaymentType();
      this.dataHistory();
      this.readHistory();
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.readOfflineDataOrderPaymentType();
      this.readOfflineDataOrderHistory();
    }));
  }

  offlineData(key, changeData) {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify(key), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    let encryptedValue = CryptoJS.AES.encrypt(
    JSON.stringify(changeData), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    localStorage.setItem(encryptedKey.toString(), encryptedValue.toString());
  }

  dataHistory(){
    let sendData = {
      numberOfTable: 1,
      action: {
        table: 'read',
        upload: false,
        join: true,
      },
      read: {
        table: "history_profile",
        joinTable: "JOIN history_app ON history_app.historyAppId = history_profile.historyAppId JOIN profile ON profile .profileId = history_profile.profileId WHERE "+
                    "history_app.date = "+
                    this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd')+
                    " AND history_app.description = "+
                    "'Added Order Menu'",
        response: "response-product"
      }
    };
    this.connectServ.readTwo(sendData)
  }

  readHistory() {
    this.connectServ.responseTwo$.pipe(takeUntil(this.subs)).subscribe(res => {
     this.orderNumber = (res.data.length+1)+Date.now()+"-"+Math.floor(Math.random() * 1000000)+"-ORD"; 
     this.offlineData('order_history', this.orderNumber);
    })
  }

  readOfflineDataOrderHistory() {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify('order_history'), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const localStorageKeyLocalStorage = localStorage.getItem(encryptedKey.toString());
    console.log(localStorageKeyLocalStorage);
    
    if (localStorageKeyLocalStorage !== null) {
      let decryptedValue = CryptoJS.AES.decrypt(
      localStorageKeyLocalStorage, this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const dataOfLocal = JSON.parse(decryptedValue.toString(CryptoJS.enc.Utf8));
      this.orderNumber = dataOfLocal;
    }
  }

  dataPaymentType() {
    let sendData = {
      numberOfTable: 1,
      action: {
        table: 'read',
        upload: false,
        join: false,
      },
      read: {
        table: "payment_type",
        response: "response-payment-type"
      }
    };
    this.connectServ.read(sendData)
  }

  readPaymentType() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.paymentType = res.data.map(x => {
        const data = {
          paymentTypeId: x.paymentTypeId,
          paymentTypeName: x.paymentTypeName,
          paymentTypeStatusActive: false,
        }
        return data;
      });
      this.paymentTypeIndex = 0;
      this.paymentType[0].paymentTypeStatusActive = true;
      this.offlineData('order_view_payment_type', this.paymentType);
    })
  }

  readOfflineDataOrderPaymentType() {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify('order_view_payment_type'), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const localStorageKeyLocalStorage = localStorage.getItem(encryptedKey.toString());
    console.log(localStorageKeyLocalStorage);
    
    if (localStorageKeyLocalStorage !== null) {
      let decryptedValue = CryptoJS.AES.decrypt(
      localStorageKeyLocalStorage, this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const dataOfLocal = JSON.parse(decryptedValue.toString(CryptoJS.enc.Utf8));
      this.paymentType = dataOfLocal;
    }
  }

  paymentTypeAction(index, paymentTypeId){
    this.paymentTypeId = paymentTypeId;
    this.paymentTypeIndex = index;
    this.paymentType[index].paymentTypeStatusActive = true;
    const filterOrderStatus = this.paymentType.filter((x, i) => {
      return i != index;
    });
    filterOrderStatus.map( xx => {
      return xx.paymentTypeStatusActive = false;
    })
  }

  newOrder() {
    this.activeRoute.params.pipe(takeUntil(this.subs)).subscribe(params => {
      const id = params.id.toString().replace(/Por21Ld/g, '/');
      let paramsId = CryptoJS.AES.decrypt(
        id, this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      this.orders = JSON.parse(paramsId).orders;
      this.statusOrder = JSON.parse(paramsId).orderStatus;
      this.dineInTableOrder = JSON.parse(paramsId).orderDineInTable;
      const subTotal = this.orders.map(x => {
        return x.subTotal;
      });
      this.totalOrder = subTotal.reduce((a,b) => {
        return a+b;
      })
      
      this.tax = {
        ppn: this.totalOrder*0.1
      }
      this.amount = this.totalOrder+this.tax.ppn;
    })
  }

  toShop(){
    this.router.navigate(['dashboard']);
  }

  confirmOrder(ev){
    this.connectServ.profile$.pipe(take(1)).subscribe(res => {
      of(this.data(res[0].profileId, ev, this.orders, this.statusOrder, this.dineInTableOrder)).pipe(takeUntil(this.subs)).subscribe(()=> {
        this.connectServ.forBillAfterOrder$.pipe(takeUntil(this.subs)).subscribe(resInsertId => {
          let encryptedRouterId = CryptoJS.AES.encrypt(
          JSON.stringify(resInsertId), this.key, {
            keySize: 16,
            iv: this.iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
          const ciphertext = encryptedRouterId.toString();
          const convertEncryptedId = ciphertext.toString().replace(/\//g,'Por21Ld');
          this.router.navigate(['print-bill/'+convertEncryptedId]);
        })
      })
    });
    this.connectServ.readDataProfile();
  }

  data(profileId, ev, orders, statusOrder, dineInTableOrder) {
    let sendData = {
      numberOfTable: 1,
      response: "response-add-order",
      action: {
        table: 'add',
        upload: false,
        join: false,
        createDataOffline: true
      },
      create: [
        {
          table:"orders",
          data: {
            customerId: null,
            tableId: dineInTableOrder,
            orderStatusId: statusOrder.orderStatusId,
            orderProduct: JSON.stringify(orders),
            paymentTypeId: ev,
            amount: this.amount,
            ref: JSON.stringify(this.ref),
            orderNumber: this.orderNumber,
            tax:  JSON.stringify(this.tax)
          },
          condition: {
            read: true,
            insertId: true,
            processAddJoin: true,
            addMultiJoin: false,
          },
          response: "response-add-order",
          toast: {
            name:  "response-add-order",
            type: 'add-non-join',
            messageToastSuccess: 'Order menu successfully',
            messageToastError: 'Order menu not successfully'
          },
          result: null,
          sendCreateJoinId: {
            key: 0,
            name: "processId"
          }
        },
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Added Order Menu"
          },
          condition: {
            read: false,
            insertId: true,
            processAddJoin: true,
            addMultiJoin: true,
          },
          response: "response-add-history",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
          result: null,
          sendCreateJoinId: {
            key: 0,
            name: "historyAppId"
          }
        }
      ],
      createJoinId: [
        {
          table: "history_profile",
          data: {
            profileId: profileId
          },
          condition: {
            read: false,
            insertId: false
          },
          response: "response-add-history-profile",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
        }
      ],
      read: {
        table: "orders",
        response: "response-order"
      },
      uploadOffline: {
        filePath: "order.json"
      },
    };
    if(navigator.onLine) {
      this.connectServ.read(sendData)
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('add_order', sendData);
    }
  }

}
