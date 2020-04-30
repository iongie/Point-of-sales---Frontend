import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { of, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-product-category',
  templateUrl: './add-product-category.component.html',
  styleUrls: ['./add-product-category.component.css']
})
export class AddProductCategoryComponent implements OnDestroy {
  dataProductCategory: any = {};
  dateHistory = new Date();
  private subs = new Subject<any>();
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    public connectServ: ConnectServerService,
    private toastr: ToastrService
  ) { }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
  }

  onSubmit(){
    this.connectServ.profile$.pipe(take(1)).subscribe(res => {
      of(this.data(res[0].profileId)).subscribe(()=> {
        this.router.navigate(['/product-category']);
        this.toastr.success('Added data product category successfully', 'Done', {
          timeOut: 1000,
          positionClass: 'toast-bottom-center'
        });
      })
    })
    this.connectServ.readDataProfile();
  }

  data(profileId) {
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
          table:"product_category",
          data: {
            productCategoryName: this.dataProductCategory.name
          },
          condition: {
            read: false,
            insertId: false,
            processAddJoin: false,
            addMultiJoin: false,
          },
          response: "response-add-product-category"
        },
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            description: "Added data product category"
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
      read: {
        table: "product_category",
        response: "response-product-category"
      },
      uploadOffline: {
        filePath: "productCategory.json"
      },
    };
    console.log(sendData);
    this.connectServ.read(sendData)
  }

  goToList(){
    this.router.navigate(['product-category']);
  } 
}
