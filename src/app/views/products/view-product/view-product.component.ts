import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { Subject, of } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit, OnDestroy {
  header = ["#", "Display name", "Image", "Price", "Category", "Kitchen type"];
  url = ['/product/add', 'searchData()'];
  searchEvent = false;
  dateHistory = new Date();
  private subs = new Subject<any>();

  envImageUrl= environment.image;
  tokenCrypto= environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  constructor(
    public connectServ: ConnectServerService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.data();
    this.read();
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
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

  read() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      const changeData = res.data.map(x => {
        const data = {
          tableOne: x.displayName,
          tableThree: x.price,
          tableFour: x.productCategoryName,
          tableFive: x.kitchenTypeName,
          tableImage: this.envImageUrl+x.image,
          idOne: x.prodCatKitcId,
          idTwo: x.productCategoryId,
          idThree: x.productId,
          idFour: x.kitchenTypeId,
          image: x.image
        }
        return data;
      });
      this.changeData(changeData);
    })
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
    this.router.navigate(['product/detail/'+ convertEncryptedId]);
  }

  dataDelete(ev) {
    const dataRecycleBin = {
      table: 'product_category_kitchen',
      data: ev
    }
    let encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(dataRecycleBin), this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    this.dataProfile(ev, encryptedData.toString())
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
      action: {
        table: "delete",
        upload: true,
        join: true,
        createDataOffline: true
      },
      create:[  
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            description: "Deleted data Product"
          },
          condition: {
            read: false,
            insertId: true,
            processAddJoin: true
          },
          response: "response-add-history",
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
        } 
      ],
      delete:[
        {
          table: "product",
          tableId: {
            name: "productId",
            data: ev.idThree
          },
          condition: {
            read: false
          },
          response: "response-delete-product"
        },
        {
          table: "product_category_kitchen",
          tableId: {
            name: "prodCatKitcId",
            data: ev.idOne
          },
          condition: {
            read: true
          },
          response: "response-delete-product-category-kitchen"
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
      read: {
        table: "product_category_kitchen",
        joinTable: "JOIN product ON product.productId = product_category_kitchen.productId JOIN product_category ON product_category.productCategoryId = product_category_kitchen.productCategoryId JOIN kitchen_type ON kitchen_type.kitchenTypeId = product_category_kitchen.kitchenTypeId",
        response: "response-product"
      },
      checkImage: {
        table: "product",
        tableId: {
          name: "image",
          data: ev.image
        },
        response: "response-checkImage-product"
      },
      uploadOffline: {
        filePath: "product.json"
      },
      upload: {
        beforeImage: ev.image
      }
    };
    of(this.connectServ.read(sendDataDelete)).pipe(take(1)).subscribe(()=> {
      this.toastr.success('Deleted data product successfully', 'Done', {
        timeOut: 1000,
        positionClass: 'toast-bottom-center'
      });
    })
  }

}
