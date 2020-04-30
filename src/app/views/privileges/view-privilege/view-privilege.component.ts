import { Component, OnInit, OnDestroy } from '@angular/core';
import { take, takeUntil, takeLast } from 'rxjs/operators';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { of, Subject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-privilege',
  templateUrl: './view-privilege.component.html',
  styleUrls: ['./view-privilege.component.css']
})
export class ViewPrivilegeComponent implements OnInit, OnDestroy {
  header = ["#", "Name"];
  url = ['/privilege/add', 'searchData()'];
  searchEvent = false;
  dateHistory = new Date();
  private subs = new Subject<any>();

  tokenCrypto= environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  constructor(
    public connectServ: ConnectServerService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router
  ) {
    
   }

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
        table: "privilege",
        response: "response-privilege"
      }
    };
    this.connectServ.read(sendData)
  }

  read() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      const changeData = res.data.map(x => {
        const data = {
          idOne: x.privilegeId,
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
    this.router.navigate(['privilege/detail/'+ convertEncryptedId]);
  }

  dataDelete(ev) {
    const dataRecycleBin = {
      table: 'privilege',
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
            description: "Deleted data privilege"
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
          table: "privilege",
          tableId: {
            name: "privilegeId",
            data: ev
          },
          condition: {
            read: true
          },
          response: "response-delete-privilege"
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
        table: "privilege",
        response: "response-privilege"
      },
      uploadOffline: {
        filePath: "privilege.json"
      }
    }
    of(this.connectServ.read(sendDataDelete)).pipe(take(1)).subscribe(() => {
      this.toastr.success('Deleted data privilege successfully', 'Done', {
        timeOut: 1000,
        positionClass: 'toast-bottom-center'
      });
    })
    
  }
  
}
