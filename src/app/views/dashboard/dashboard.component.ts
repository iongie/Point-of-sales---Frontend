import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { Subject, of, Observable, Subscription, fromEvent } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { CdkDragEnd, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subs = new Subject<any>();
  product: any = [];
  diningTable: any = [];
  orderStatus: any = [];
  orders: any = [];
  order: any = {};
  statusOrder: any = {};
  dineInTableOrder: any = {};
  totalOrder: any = {};
  activeDineInTable = false;
  filterData;

  
  dateHistory = new Date();

  envImageUrl= environment.image;
  activeOrderStatus = false;

  tokenCrypto= environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];
  constructor(
    public connectServ: ConnectServerService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.statusConnection();
    if(navigator.onLine) {
      this.dataProduct();
      this.readProduct();
      this.dataOrderStatus();
      this.readOrderStatus();
      this.dataDIningTable();
      this.readDiningTable();
    } else if (!navigator.onLine) {
      this.readOfflineDataOrderDiningTable();
      this.readOfflineDataOrderOrderStatus();
      this.readOfflineDataOrderProduct();
    }
    
    this.orders;
    this.statusOrder = null;
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
      this.dataProduct();
      this.readProduct();
      this.dataOrderStatus();
      this.readOrderStatus();
      this.dataDIningTable();
      this.readDiningTable();
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.readOfflineDataOrderDiningTable();
      this.readOfflineDataOrderOrderStatus();
      this.readOfflineDataOrderProduct();
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

  dataProduct() {
    let sendData = {
      numberOfTable: 1,
      action: {
        table: 'read',
        upload: false,
        join: true,
      },
      read: {
        table: "product_category_kitchen",
        joinTable: "JOIN product ON product.productId = product_category_kitchen.productId JOIN product_category ON product_category.productCategoryId = product_category_kitchen.productCategoryId JOIN kitchen_type ON kitchen_type.kitchenTypeId = product_category_kitchen.kitchenTypeId",
        response: "response-product"
      }
    };
    this.connectServ.read(sendData)
  }

  readProduct() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
        this.product = res.data.map(x => {
          const data = {
            displayName: x.displayName,
            image: x.image,
            kitchenTypeId: x.kitchenTypeId,
            kitchenTypeName: x.kitchenTypeName,
            price: x.price,
            prodCatKitcId: x.prodCatKitcId,
            productCategoryId: x.productCategoryId,
            productCategoryName: x.productCategoryName,
            productId: x.productId,
            productChecked: false,
            prductQty: 0
          }
          return data;
        })
      this.offlineData('order_view_product', this.product);
    })
  }
  
  readOfflineDataOrderProduct() {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify('order_view_product'), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const localStorageKeyLocalStorage = localStorage.getItem(encryptedKey.toString());
    
    if (localStorageKeyLocalStorage !== null) {
      let decryptedValue = CryptoJS.AES.decrypt(
      localStorageKeyLocalStorage, this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const dataOfLocal = JSON.parse(decryptedValue.toString(CryptoJS.enc.Utf8));
      this.product = dataOfLocal;
    }
  }

  dataOrderStatus() {
    let sendData = {
      numberOfTable: 1,
      action: {
        table: 'read',
        upload: false,
        join: false,
      },
      read: {
        table: "order_status",
        response: "response-order-status"
      }
    };
    this.connectServ.readTwo(sendData)
  }

  readOrderStatus() {
    this.connectServ.responseTwo$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.orderStatus = res.data.map(x => {
        const data = {
          orderStatusId: x.orderStatusId,
          orderStatusName: x.orderStatusName,
          orderStatusActive: false,
        }
        return data;
      })
      this.offlineData('order_view_order_status', this.orderStatus);
    })
  }

  readOfflineDataOrderOrderStatus() {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify('order_view_order_status'), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const localStorageKeyLocalStorage = localStorage.getItem(encryptedKey.toString());
    
    if (localStorageKeyLocalStorage !== null) {
      let decryptedValue = CryptoJS.AES.decrypt(
      localStorageKeyLocalStorage, this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const dataOfLocal = JSON.parse(decryptedValue.toString(CryptoJS.enc.Utf8));
      this.orderStatus = dataOfLocal;
    }
  }

  dataDIningTable() {
    let sendData = {
      numberOfTable: 1,
      action: {
        table: 'read',
        upload: false,
        join: false,
      },
      read: {
        table: "dining_table",
        response: "response-dining-table"
      }
    };
    this.connectServ.readThree(sendData)
  }

  readDiningTable() {
    this.connectServ.responseThree$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.diningTable = res.data.map(x => {
        const data = {
          diningTableId: x.diningTableId,
          diningTableName: x.name,
          diningTablePosition: x.position,
          diningTableActive: false,
        }
        return data;
      });
      this.offlineData('order_view_dining_table', this.diningTable);
    })
  }

  readOfflineDataOrderDiningTable() {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify('order_view_dining_table'), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const localStorageKeyLocalStorage = localStorage.getItem(encryptedKey.toString());
    
    if (localStorageKeyLocalStorage !== null) {
      let decryptedValue = CryptoJS.AES.decrypt(
      localStorageKeyLocalStorage, this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const dataOfLocal = JSON.parse(decryptedValue.toString(CryptoJS.enc.Utf8));
      this.diningTable = dataOfLocal;
    }
  }

  orderStatusAction(index, orderStatus) {
    this.orderStatus[index].orderStatusActive = true;
    const filterOrderStatus = this.orderStatus.filter((x, i) => {
      return i != index;
    });
    filterOrderStatus.map( xx => {
      return xx.orderStatusActive = false;
    })
    this.statusOrder = orderStatus;
    this.activeDineInTable = true;
    if(index == 0) {
      this.activeDineInTable = true;
    } else {
      this.dineInTableOrder = null;
      this.activeDineInTable = false;
    }
  }

  diningTableAction(index, diningTable){
    this.diningTable.map( xx => {
      return xx.diningTableActive = false;
    })
    this.diningTable[index].diningTableActive = true;
    const filterDiningTable = this.orderStatus.filter((x, i) => {
      return i != index;
    });
    filterDiningTable.map( xx => {
      return xx.diningTableActive = false;
    })
    this.dineInTableOrder = diningTable;
  }

  orderProduct(product, one) {
    product.productChecked = true; 
    product.prductQty= product.prductQty+one;  
    if(this.orders.length === 0){
      this.order =  {
        prodCatKitcId: product.prodCatKitcId,
        productId: product.productId,
        productCategoryId: product.productCategoryId,
        kitchenTypeId: product.kitchenTypeId,
        displayName: product.displayName,
        image: product.image,
        kitchen: product.kitchenTypeName,
        category: product.productCategoryName,
        price: product.price,
        qty: 1,
        subTotal: product.price * 1,
      };
      this.orders.push(this.order);
    } else {
      const filterOrder = this.orders.filter(x => {
        return x.prodCatKitcId == product.prodCatKitcId;
      })
      if(filterOrder.length == 0) {
        this.order =  {
          prodCatKitcId: product.prodCatKitcId,
          productId: product.productId,
          productCategoryId: product.productCategoryId,
          kitchenTypeId: product.kitchenTypeId,
          displayName: product.displayName,
          image: product.image,
          kitchen: product.kitchenTypeName,
          category: product.productCategoryName,
          price: product.price,
          qty: 1,
          subTotal: product.price * 1,
        };
        this.orders.push(this.order);
      } else {
        filterOrder[0].qty = filterOrder[0].qty+1;
        filterOrder[0].subTotal = filterOrder[0].price*filterOrder[0].qty;
      }
    }
    const subTotal = this.orders.map(x => {
      return x.subTotal;
    });
    this.totalOrder = subTotal.reduce((a,b) => {
      return a+b;
    })
  }

  deleteProduct(product, index){
    this.orders = this.orders.filter(x => {
      return x.prodCatKitcId != product.prodCatKitcId;
    })
    product.productChecked = false;
    product.prductQty = 0;
  }

  toCart() {
    let data = {
      orderStatus: this.statusOrder,
      orders: this.orders,
      orderDineInTable: this.dineInTableOrder   
    };
    
    let encryptedId = CryptoJS.AES.encrypt(
    JSON.stringify(data), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const ciphertext = encryptedId.toString();
    const convertEncryptedId = ciphertext.toString().replace(/\//g,'Por21Ld');
    this.router.navigate(['cart/'+convertEncryptedId]);
  }

}
