import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Subject, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { takeUntil, take } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-view-by-id-product',
  templateUrl: './view-by-id-product.component.html',
  styleUrls: ['./view-by-id-product.component.css']
})
export class ViewByIdProductComponent implements OnInit, OnDestroy {
  tokenCrypto= environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  dataProduct: any = {};
  productCategories: any = [];
  kitchenTypes: any = [];
  dateHistory = new Date();
  private subs: Subject<void> = new Subject();
  envImageUrl= environment.image;
  // TODO: Setting for upload
  fileData = new FormData();
  reader = new FileReader();
  selectedFile: File = null;
  imgURL: any;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    public connectServ: ConnectServerService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.activeRouted();
    this.read();
    this.dataProductCategory();
    this.readProductCategory();
    this.dataKitchenType();
    this.readKitchenType();
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
  }

  dataProductCategory() {
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
    this.connectServ.readTwo(sendData)
  }

  readProductCategory() {
    this.connectServ.responseTwo$.pipe(take(1)).subscribe(res => {
      this.productCategories = res.data;
    })
  }

  dataKitchenType() {
    let sendData = {
      numberOfTable: 1,
      action: {
        table: 'read',
        upload: false,
        join: false,
      },
      read: {
        table: "kitchen_type",
        response: "response-kitchen-type"
      }
    };
    this.connectServ.readThree(sendData)
  }

  readKitchenType() {
    this.connectServ.responseThree$.pipe(take(1)).subscribe(res => {
      this.kitchenTypes = res.data;
    })
  }

  activeRouted() {
    this.activeRoute.params.pipe(takeUntil(this.subs)).subscribe(params => {
      const id = params.id.toString().replace(/Por21Ld/g, '/');
      let paramsId = CryptoJS.AES.decrypt(
        id, this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      this.data(paramsId)
    });
  }

  data(paramsId){
    const sendDataById = {
      numberOfTable: 1,
      action: {
        table: "read-by-id",
        upload: false,
        join: true
      },
      read: {
        table: "product_category_kitchen",
        tableId: {
          name: "prodCatKitcId= ?",
          data: paramsId
        },
        joinTable: "JOIN product ON product.productId = product_category_kitchen.productId JOIN product_category ON product_category.productCategoryId = product_category_kitchen.productCategoryId JOIN kitchen_type ON kitchen_type.kitchenTypeId = product_category_kitchen.kitchenTypeId",
        response: "response-read-by-id-product-category-kitchen"
      }
    }
    this.connectServ.read(sendDataById)
  }

  read() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.dataProduct.name= res.data[0].displayName;
      this.dataProduct.price= res.data[0].price;
      this.dataProduct.product= res.data[0].productId;
      this.dataProduct.productCategory= res.data[0].productCategoryId;
      this.dataProduct.kitchenType= res.data[0].kitchenTypeId;
      this.dataProduct.beforeImage= res.data[0].image;
      this.dataProduct.image= res.data[0].image;
      this.imgURL = this.envImageUrl + res.data[0].image;
    })
  }

  onFile(event) {
    this.selectedFile = <File>event.target.files[0];
    this.reader.readAsDataURL(this.selectedFile);
    this.reader.onload = (_event) => {
      this.imgURL = this.reader.result;
    };
  }

  onSubmit(){
    this.connectServ.profile$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.activeRoute.params.pipe(takeUntil(this.subs)).subscribe(params => {
        if (this.dataProduct.kitchenType != 0 && this.dataProduct.productCategory != 0) {
          if(this.selectedFile) {
            this.dataProduct.selectedFile = this.selectedFile;
            this.dataProduct.image = this.selectedFile.name;
          }
          const id = params.id.toString().replace(/Por21Ld/g, '/');
          let paramsId = CryptoJS.AES.decrypt(
            id, this.key, {
            keySize: 16,
            iv: this.iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          }).toString(CryptoJS.enc.Utf8);
          of(this.dataUpdate(paramsId, res[0].profileId)).pipe(takeUntil(this.subs)).subscribe(()=> {
            this.router.navigate(['/product']);
          })
        }
      });
    });
    this.connectServ.readDataProfile();
  }

  dataUpdate(paramsId, profileId) {
    let sendDataUpdate = {
      numberOfTable: 1,
      response: "response-update-product-category-kitchen",
      action: {
        table: "update",
        upload: true,
        join: true,
        createDataOffline: true
      },
      create:[
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Updated data Product"
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
      update:[
        {
          table: "product",
          tableId: {
            name: "productId",
            data: this.dataProduct.product
          },
          data: "displayName='"+this.dataProduct.name+"',price='"+this.dataProduct.price+"',image='"+this.dataProduct.image+"'",
          condition: {
            read: false
          },
          response: "response-product",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
        },
        {
          table: "product_category_kitchen",
          tableId: {
            name: "prodCatKitcId",
            data: paramsId
          },
          data: "productCategoryId='"+this.dataProduct.productCategory+"',productId='"+this.dataProduct.product+"',kitchenTypeId='"+this.dataProduct.kitchenType+"'",
          condition: {
            read: true
          },
          response: "response-update-product-category-kitchen",
          toast: {
            name:  "response-update-product-category-kitchen",
            type: 'update',
            messageToastSuccess: 'Update data product successfully',
            messageToastError: 'Update data product not successfully'
          },
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
        table: "product_category_kitchen",
        joinTable: "JOIN product ON product.productId = product_category_kitchen.productId JOIN product_category ON product_category.productCategoryId = product_category_kitchen.productCategoryId JOIN kitchen_type ON kitchen_type.kitchenTypeId = product_category_kitchen.kitchenTypeId",
        response: "response-product"
      },
      checkImage: {
        table: "product",
        tableId: {
          name: "image",
          data: this.dataProduct.beforeImage
        },
        response: "response-checkImage-product"
      },
      uploadOffline: {
        filePath: "product.json"
      },
      upload: {
        filePath: this.dataProduct.image,
        selectedFile: this.dataProduct.selectedFile,
        beforeImage: this.dataProduct.beforeImage,
        base64: this.imgURL
      }
    };
    if(navigator.onLine) {
      this.connectServ.read(sendDataUpdate)
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('update_product', sendDataUpdate);
    }
  }

  goToList() {
    this.router.navigate(['product']);
  }
}
