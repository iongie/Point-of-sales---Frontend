import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { Subject, of } from 'rxjs';
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

  envImageUrl= environment.image;
  activeOrderStatus = false;

  tokenCrypto= environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);

  @ViewChild("item")
  item: ElementRef;

  initialPosition = { x: 100, y: 100 };
  position = { ...this.initialPosition };
  offset = { x: 0, y: 0 };
  constructor(
    public connectServ: ConnectServerService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router
  ) { }

  dragEnd(event: CdkDragEnd) {
    const transform = this.item.nativeElement.style.transform;
    let regex = /translate3d\(\s?(?<x>[-]?\d*)px,\s?(?<y>[-]?\d*)px,\s?(?<z>[-]?\d*)px\)/;
    var values = regex.exec(transform);
    console.log(transform);
    this.diningTable.map(x => {
      const data = {
        diningTableId: x.diningTableId,
        diningTableName: x.name,
        diningStyle: "transform: "+transform,
      }
      return data;
    })
 
  }

  ngOnInit(): void {
    this.dataProduct();
    this.readProduct();
    this.dataOrderStatus();
    this.readOrderStatus();
    this.dataDIningTable();
    this.readDiningTable();
    this.orders;
    this.statusOrder = null;
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
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
    })
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
    })
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
          diningStyle: "transform: translate3d(366px, -15px, 0px) translate3d(-94px, -93px, 0px)",
        }
        return data;
      });
      console.log(this.diningTable);
      
    })
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

  diningTableAction(diningTable){
    this.dineInTableOrder = diningTable.diningTableId;
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
