import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit, OnDestroy {
  dataProduct: any = {};
  productCategories: any = [];
  kitchenTypes: any = [];
  dateHistory = new Date();
  private subs = new Subject<any>();
  // TODO: Setting for upload
  fileData = new FormData();
  reader = new FileReader();
  selectedFile: File = null;
  imgURL: any;

  
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
    this.imgURL = 'assets/img/avatars/placeholder.jpg';
    this.dataProduct.image = 'assets/img/avatars/placeholder.jpg';
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

  onFile(event) {
    this.selectedFile = <File>event.target.files[0];
    this.reader.readAsDataURL(this.selectedFile);
    this.reader.onload = (_event) => {
      this.imgURL = this.reader.result;
    };
  }

  onSubmit(){
    this.connectServ.profile$.pipe(takeUntil(this.subs)).subscribe(res => {
      if (this.dataProduct.kitchenType != 0 && this.dataProduct.productCategory != 0) {
        if(this.selectedFile) {
          this.dataProduct.selectedFile = this.selectedFile;
          this.dataProduct.image = this.selectedFile.name;
        } else {
          this.dataProduct.image = 'placeholder.jpg';
        }
        
        of(this.data(res[0].profileId)).pipe(take(1)).subscribe(()=> {
          this.router.navigate(['/product']);
        })
      }
    })
    this.connectServ.readDataProfile();
  }

  data(profileId) {
    let sendData = {
      numberOfTable: 1,
      response: "response-add-product-category-kitchen",
      action: {
        table: 'add',
        upload: true,
        join: true,
        createDataOffline: true
      },
      create: [
        {
          table:"product",
          data: {
            displayName: this.dataProduct.name,
            price: this.dataProduct.price,
            image: this.dataProduct.image,
          },
          condition: {
            read: false,
            insertId: true,
            processAddJoin: true,
            addMultiJoin: false,
          },
          response: "response-add-product",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
          result: null,
          sendCreateJoinId: {
            key: 1,
            name: "productId"
          }
        },
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Added data product"
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
        },
        {
          table: "product_category_kitchen",
          data: {
            kitchenTypeId: this.dataProduct.kitchenType,
            productCategoryId: this.dataProduct.productCategory,
          },
          condition: {
            read: true,
            insertId: false
          },
          response: "response-add-product-category-kitchen",
          toast: {
            name:  "response-add-product-category-kitchen",
            type: 'add-join',
            messageToastSuccess: 'Added data product successfully',
            messageToastError: 'Added data product not successfully'
          },
        }
      ],
      read: {
        table: "product_category_kitchen",
        joinTable: "JOIN product ON product.productId = product_category_kitchen.productId JOIN product_category ON product_category.productCategoryId = product_category_kitchen.productCategoryId JOIN kitchen_type ON kitchen_type.kitchenTypeId = product_category_kitchen.kitchenTypeId",
        response: "response-product"
      },
      uploadOffline: {
        filePath: "product.json"
      },
      upload: {
        filePath: this.dataProduct.image,
        selectedFile: this.dataProduct.selectedFile,
        base64: this.imgURL
      }
    };
    if(navigator.onLine) {
      this.connectServ.read(sendData)
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('add_product', sendData);
    }
  }

  goToList(){
    this.router.navigate(['product']);
  } 
}
