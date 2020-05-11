import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil, take } from 'rxjs/operators';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { of, Subject, Observable, Subscription, fromEvent } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-order-status',
  templateUrl: './view-order-status.component.html',
  styleUrls: ['./view-order-status.component.css']
})
export class ViewOrderStatusComponent implements OnInit, OnDestroy {
  header = ["#", "Name"];
  url = ['/order-status/add', 'searchData()'];
  searchEvent = false;
  dateHistory = new Date();
  private subs: Subject<void> = new Subject();

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
      this.data();
      this.read();
    } else if (!navigator.onLine) {
      this.readOfflineData();
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
      this.data();
      this.read();
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.readOfflineData();
    }));
  }

  ngOnFilter(data) {
    this.connectServ.filterDataEvent(data);
  }
  disabledFilter(ev) {
    this.searchEvent = ev;
  }

  data() {
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
    this.connectServ.read(sendData)
  }

  read() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      const changeData = res.data.map(x => {
        const data = {
          idOne: x.orderStatusId,
          tableOne: x.orderStatusName
        }
        return data;
      });
      this.changeData(changeData);
      this.offlineData(changeData);
    })
  }

  offlineData(changeData) {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify('view_order_status'), this.key, {
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

  readOfflineData() {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify('view_order_status'), this.key, {
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
      this.connectServ.localOfData(dataOfLocal);
    }
  }

  changeData(data) {
    this.connectServ.changeDataRead(data)
  }

  receiveEvent(ev){
    this.searchEvent = ev;
  }

  dataUpdate(ev) {
    let encryptedId = CryptoJS.AES.encrypt(
    JSON.stringify(ev), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const ciphertext = encryptedId.toString();
    const convertEncryptedId = ciphertext.toString().replace(/\//g,'Por21Ld');
    this.router.navigate(['order-status/detail/'+ convertEncryptedId]);
  }

  dataDelete(ev) {
    this.connectServ.profile$.pipe(take(1)).subscribe(res => {
      const dataRecycleBin = {
        table: 'order_status',
        data: ev
      }
      let encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataRecycleBin), this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      of(this.actionDelete(ev.idOne, encryptedData.toString(),res[0].profileId)).pipe(take(1)).subscribe(()=> {
      })
    });
    this.connectServ.readDataProfile();
  }

  actionDelete(ev, data, profileId){
    let sendDataDelete = {
      numberOfTable: 1,
      response: "response-delete-order-status",
      action: {
        table: "delete",
        upload: false,
        join: false,
        createDataOffline: true
      },
      create:[  
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Deleted data order status"
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
        },
        {
          table: "recycle_bin",
          data: {
            recycleData: data
          },
          condition: {
            read: false,
            insertId: false,
            processAddJoin: false
          },
          response: "response-add-recycle-bin",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
        } 
      ],
      delete:[
        {
          table: "order_status",
          tableId: {
            name: "orderStatusId",
            data: ev
          },
          condition: {
            read: true
          },
          response: "response-delete-order-status",
          toast: {
            name:  "response-delete-order-status",
            type: 'delete',
            messageToastSuccess: 'Delete data order status successfully',
            messageToastError: 'Delete data order status not successfully'
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
        table: "order_status",
        response: "response-order-status"
      },
      uploadOffline: {
        filePath: "orderStatus.json"
      }
    }
    if(navigator.onLine) {
      this.connectServ.read(sendDataDelete)
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('delete_order_status', sendDataDelete);
    }
  }
}
