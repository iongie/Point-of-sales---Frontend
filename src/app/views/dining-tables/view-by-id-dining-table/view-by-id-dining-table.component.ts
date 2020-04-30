import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import io from 'socket.io-client';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { of, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-by-id-dining-table',
  templateUrl: './view-by-id-dining-table.component.html',
  styleUrls: ['./view-by-id-dining-table.component.css']
})
export class ViewByIdDiningTableComponent implements OnInit, OnDestroy {
  tokenCrypto= environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  dataDiningTable: any = {};
  dateHistory = new Date();
  private subs: Subject<void> = new Subject();
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
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
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
        join: false
      },
      read: {
        table: "dining_table",
        tableId: {
          name: "diningTableId= ?",
          data: paramsId
        },
        response: "response-read-by-id-dining-table"
      }
    }
    this.connectServ.read(sendDataById)
  }

  read() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.dataDiningTable.name = res.data[0].name;
    })
  }

  onSubmit(){
    this.connectServ.profile$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.activeRoute.params.pipe(takeUntil(this.subs)).subscribe(params => {
        const id = params.id.toString().replace(/Por21Ld/g, '/');
        let paramsId = CryptoJS.AES.decrypt(
          id, this.key, {
          keySize: 16,
          iv: this.iv,
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
        of(this.dataUpdate(paramsId, res[0].profileId)).pipe(takeUntil(this.subs)).subscribe(()=> {
          this.router.navigate(['/dining-table']);
          this.toastr.success('Update data dining table successfully', 'Done', {
            timeOut: 1000,
            positionClass: 'toast-bottom-center'
          });
        })
      });
    });
    this.connectServ.readDataProfile();
  }

  dataUpdate(paramsId, profileId) {
    let sendDataUpdate = {
      numberOfTable: 1,
      action: {
        table: "update",
        upload: false,
        join: false,
        createDataOffline: true
      },
      create:[
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            description: "Updated data dining table"
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
        } 
      ],
      update:[
        {
          table: "dining_table",
          tableId: {
            name: "diningTableId",
            data: paramsId
          },
          data: "name='"+this.dataDiningTable.name+"'",
          condition: {
            read: false
          },
          response: "response-update-dining-table"
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
        table: "dining_table",
        response: "response-read-dining-table"
      },
      uploadOffline: {
        filePath: "diningTable.json"
      }
    };
    this.connectServ.read(sendDataUpdate)
  }

  goToList(){
    this.router.navigate(['dining-table']);
  }
}
