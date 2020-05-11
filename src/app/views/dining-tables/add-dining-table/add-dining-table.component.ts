import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { of, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, take } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-dining-table',
  templateUrl: './add-dining-table.component.html',
  styleUrls: ['./add-dining-table.component.css']
})
export class AddDiningTableComponent implements OnDestroy {
  dataDiningTable: any = {};
  dateHistory = new Date();
  private subs: Subject<void> = new Subject();

  tokenCrypto= environment.tokenCrypto;
  _key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  _iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
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
        this.router.navigate(['/dining-table']);
      })
    })
    this.connectServ.readDataProfile();
  }

  data(profileId) {
    let sendData = {
      numberOfTable: 1,
      response: "response-add-dining-table",
      action: {
        table: 'add',
        upload: false,
        join: false,
        createDataOffline: true
      },
      create: [
        {
          table:"dining_table",
          data: {
            name: this.dataDiningTable.name,
            position: "translate3d(125px, 214px, 0px) translate3d(79px, 31px, 0px) translate3d(75px, -121px, 0px) translate3d(290px, 8px, 0px) translate3d(-477px, 71px, 0px) translate3d(578px, 14px, 0px)"
          },
          condition: {
            read: false,
            insertId: false,
            processAddJoin: false,
            addMultiJoin: false,
          },
          response: "response-add-dining-table",
          toast: {
            name:  "response-add-dining-table",
            type: 'add-non-join',
            messageToastSuccess: 'Added data dining table successfully',
            messageToastError: 'Added data dining table not successfully'
          },
        },
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Added data dining table"
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
        }
      ],
      read: {
        table: "dining-table",
        response: "response-dining-table"
      },
      uploadOffline: {
        filePath: "diningTable.json"
      },
    };
    if(navigator.onLine) {
      this.connectServ.read(sendData)
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('add_dining_table', sendData);
    }
    
  }

  goToList(){
    this.router.navigate(['dining-table']);
  } 

}
