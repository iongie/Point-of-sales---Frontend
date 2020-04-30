import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil, take } from 'rxjs/operators';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { of, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-dining-table',
  templateUrl: './view-dining-table.component.html',
  styleUrls: ['./view-dining-table.component.css']
})
export class ViewDiningTableComponent implements OnInit, OnDestroy {
  header = ["#", "Name"];
  url = ['/dining-table/add', 'searchData()'];
  searchEvent = false;
  dateHistory = new Date();
  private subs: Subject<void> = new Subject();

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
        join: false,
      },
      read: {
        table: "dining_table",
        response: "response-dining-table"
      }
    };
    this.connectServ.read(sendData)
  }

  read() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      const changeData = res.data.map(x => {
        const data = {
          idOne: x.diningTableId,
          tableOne: x.name
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
    this.router.navigate(['dining-table/detail/'+ convertEncryptedId]);
  }

  dataDelete(ev) {
    this.connectServ.profile$.pipe(take(1)).subscribe(res => {
      const dataRecycleBin = {
        table: 'dining_table',
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
        this.toastr.success('Deleted data dining table successfully', 'Done', {
          timeOut: 1000,
          positionClass: 'toast-bottom-center'
        });
      })
    });
    this.connectServ.readDataProfile();
  }

  actionDelete(ev, data, profileId){
    let sendDataDelete = {
      numberOfTable: 1,
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
            description: "Deleted data dining table"
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
          table: "dining_table",
          tableId: {
            name: "diningTableId",
            data: ev
          },
          condition: {
            read: true
          },
          response: "response-delete-dining-table"
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
        response: "response-dining-table"
      },
      uploadOffline: {
        filePath: "diningTable.json"
      }
    }
    this.connectServ.read(sendDataDelete)
  }
}
