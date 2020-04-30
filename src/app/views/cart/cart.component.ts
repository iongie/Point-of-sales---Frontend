import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  orders: any = [];
  totalOrder:any = {};
  statusOrder: any = {};
  dineInTableOrder: any = {};
  private subs = new Subject<any>();

  tokenCrypto= environment.tokenCrypto;
  imgURL = environment.image;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  constructor(
    public connectServ: ConnectServerService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.newOrder();
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
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
      this.dineInTableOrder = JSON.parse(paramsId).orderDineInTable;
      this.statusOrder = JSON.parse(paramsId).orderStatus;
      const subTotal = this.orders.map(x => {
        return x.subTotal;
      });
      this.totalOrder = subTotal.reduce((a,b) => {
        return a+b;
      })
    })
  }

  updateQty(index) {
    this.orders[index].subTotal = this.orders[index].price*this.orders[index].qty; 
    const subTotal = this.orders.map(x => {
      return x.subTotal;
    });

    if(this.orders.length == 0) {
      this.totalOrder = 0;
    } else {
      this.totalOrder = subTotal.reduce((a,b) => {
        return a+b;
      })
    }


    if(this.orders[index].qty == 0) {
      this.orders = this.orders.filter((x, i) => {
        return index != i;
      });
  
      const subTotal = this.orders.map(x => {
        return x.subTotal;
      });
  
      if(this.orders.length == 0) {
        this.totalOrder = 0;
      } else {
        this.totalOrder = subTotal.reduce((a,b) => {
          return a+b;
        })
      }
    }
  }

  deleteOrder(index){
    this.orders = this.orders.filter((x, i) => {
      return index != i;
    });

    const subTotal = this.orders.map(x => {
      return x.subTotal;
    });

    if(this.orders.length == 0) {
      this.totalOrder = 0;
    } else {
      this.totalOrder = subTotal.reduce((a,b) => {
        return a+b;
      })
    }
  }

  toShop(){
    this.router.navigate(['dashboard']);
  }

  toPayment(){
    let data = {
      orderStatus: this.statusOrder,
      orders: this.orders,
      orderTotal: this.totalOrder,
      orderDineInTable: this.dineInTableOrder
    }
    let encryptedId = CryptoJS.AES.encrypt(
    JSON.stringify(data), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const ciphertext = encryptedId.toString();
    const convertEncryptedId = ciphertext.toString().replace(/\//g,'Por21Ld');
    this.router.navigate(['pay/'+convertEncryptedId]);
  }

}
