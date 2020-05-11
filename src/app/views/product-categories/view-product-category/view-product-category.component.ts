import { Component, OnInit, OnDestroy } from '@angular/core';
import { take, takeUntil, takeLast } from 'rxjs/operators';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { of, Subject, Subscription, Observable, fromEvent } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-product-category',
  templateUrl: './view-product-category.component.html',
  styleUrls: ['./view-product-category.component.css']
})
export class ViewProductCategoryComponent implements OnInit, OnDestroy {
  header = ["#", "Name"];
  url = ['/product-category/add', 'searchData()'];
  searchEvent = false;
  dateHistory = new Date();
  private subs = new Subject<any>();

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
  ) {
    
   }

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
        table: "product_category",
        response: "response-product-category"
      }
    };
    this.connectServ.read(sendData)
  }

  read() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      const changeData = res.data.map(x => {
        const data = {
          idOne: x.productCategoryId,
          tableOne: x.productCategoryName,
        }
        return data;
      });
      this.changeData(changeData);
      this.offlineData(changeData);
    })
  }

  offlineData(changeData) {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify('view_product_category'), this.key, {
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
      JSON.stringify('view_product_category'), this.key, {
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
    this.router.navigate(['product-category/detail/'+ convertEncryptedId]);
  }

  dataDelete(ev) {
    const dataRecycleBin = {
      table: 'product-category',
      data: ev
    }
    let encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(dataRecycleBin), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    this.dataProfile(ev.idOne, encryptedData.toString())
    this.connectServ.readDataProfile();
  }

  dataProfile(ev, data){
    this.connectServ.profile$.pipe(take(1)).subscribe(res => {
      this.actionDelete(ev, data, res[0].profileId)
    })
  }

  actionDelete(ev, data, profileId){
    let sendDataDelete = {
      numberOfTable: 1,
      response: "response-delete-product-category",
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
            description: "Deleted data privilege"
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
          table: "product_category",
          tableId: {
            name: "productCategoryId",
            data: ev
          },
          condition: {
            read: true
          },
          response: "response-delete-product-category",
          toast: {
            name:  "response-delete-product-category",
            type: 'delete',
            messageToastSuccess: 'Delete data product category successfully',
            messageToastError: 'Delete data product category not successfully'
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
        table: "product_category",
        response: "response-product-category"
      },
      uploadOffline: {
        filePath: "productCategory.json"
      }
    }
    if(navigator.onLine) {
      of(this.connectServ.read(sendDataDelete)).pipe(take(1)).subscribe(()=> {
      })
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('delete_product_category', sendDataDelete);
    }
    
  }
 
}
