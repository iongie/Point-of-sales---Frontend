import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, of } from 'rxjs';
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
  dineInTableOrder: any = {};
  ref: any = {};
  dateHistory = new Date();
  private subs = new Subject<any>();

  tokenCrypto= environment.tokenCrypto;
  imgURL = environment.image;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);

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
    this.dataPaymentType();
    this.readPaymentType();
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
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
      this.paymentTypeId = 0;
      this.paymentType[0].paymentTypeStatusActive = true;
    })
  }

  paymentTypeAction(index){
    this.paymentTypeId = index;
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
      
      this.amount = this.totalOrder;
      console.log(JSON.parse(paramsId));
      
    })
  }

  toShop(){
    this.router.navigate(['dashboard']);
  }

  confirmOrder(ev){
    console.log(this.statusOrder);
    this.connectServ.profile$.pipe(take(1)).subscribe(res => {
      console.log(res[0].profileId);
      of(this.data(res[0].profileId, ev, this.orders, this.statusOrder, this.dineInTableOrder)).pipe(takeUntil(this.subs)).subscribe(()=> {
        this.router.navigate(['/dashboard']);
        this.toastr.success('Added data order successfully', 'Done', {
          timeOut: 1000,
          positionClass: 'toast-bottom-center'
        });
      })
    });
    this.connectServ.readDataProfile();
  }

  data(profileId, ev, orders, statusOrder, dineInTableOrder) {
    let sendData = {
      numberOfTable: 1,
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
            ref: JSON.stringify(this.ref)
          },
          condition: {
            read: false,
            insertId: false,
            processAddJoin: false,
            addMultiJoin: false,
          },
          response: "response-add-order",
          result: null,
          sendCreateJoinId: {
            key: 1,
            name: "orderId"
          }
        },
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            description: "Added data product"
          },
          condition: {
            read: false,
            insertId: true,
            processAddJoin: true,
            addMultiJoin: true,
          },
          response: "response-add-history",
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
          response: "response-add-history-profile"
        }
      ],
      uploadOffline: {
        filePath: "order.json"
      },
    };
    console.log(sendData);
    
    this.connectServ.read(sendData)
  }

}
