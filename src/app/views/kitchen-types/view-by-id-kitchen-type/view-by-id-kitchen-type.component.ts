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
  selector: 'app-view-by-id-kitchen-type',
  templateUrl: './view-by-id-kitchen-type.component.html',
  styleUrls: ['./view-by-id-kitchen-type.component.css']
})
export class ViewByIdKitchenTypeComponent implements OnInit, OnDestroy {
  tokenCrypto = environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  dataKitchenType: any = {};
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

  data(paramsId) {
    const sendDataById = {
      numberOfTable: 1,
      action: {
        table: "read-by-id",
        upload: false,
        join: false
      },
      read: {
        table: "kitchen_type",
        tableId: {
          name: "kitchenTypeId= ?",
          data: paramsId
        },
        response: "response-read-by-id-kitchen-type"
      }
    }
    this.connectServ.read(sendDataById)
  }

  read() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.dataKitchenType.name = res.data[0].kitchenTypeName;
    })
  }

  onSubmit() {
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
        of(this.dataUpdate(paramsId, res[0].profileId)).pipe(takeUntil(this.subs)).subscribe(() => {
          this.router.navigate(['/kitchen-type']);
        })
      });
    });
    this.connectServ.readDataProfile();
  }

  dataUpdate(paramsId, profileId) {
    let sendDataUpdate = {
      numberOfTable: 1,
      response: "response-update-kitchen-type",
      action: {
        table: "update",
        upload: false,
        join: false,
        createDataOffline: true
      },
      create: [
        {
          table: "history_app",
          data: {
            date: this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Updated data kitchen-type"
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
      update: [
        {
          table: "kitchen_type",
          tableId: {
            name: "kitchenTypeId",
            data: paramsId
          },
          data: "kitchenTypeName='" + this.dataKitchenType.name + "'",
          condition: {
            read: false
          },
          response: "response-update-kitchen-type",
          toast: {
            name:  "response-update-kitchen-type",
            type: 'update',
            messageToastSuccess: 'update data kitchen type successfully',
            messageToastError: 'update data kitchen type not successfully'
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
        table: "kitchen_type",
        response: "response-read-kitchen-type"
      },
      uploadOffline: {
        filePath: "kitchenType.json"
      }
    };
    if(navigator.onLine) {
      this.connectServ.read(sendDataUpdate)
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('update_kitchen_type', sendDataUpdate);
    }
  }

  goToList() {
    this.router.navigate(['kitchen-type']);
  }
}
