import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { Subject, of, Observable, Subscription, fromEvent } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, OnDestroy {
  header = ["#", "Display name", "Photo", "Username", "Email", "Address", "Privilege"];
  url = ['/user/add', 'searchData()'];
  searchEvent = false;
  dateHistory = new Date();
  private subs: Subject<void> = new Subject();

  envImageUrl= environment.image;
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
  ) { }

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
        join: true,
      },
      read: {
        table: "auth_profile_privilege",
        joinTable: "JOIN auth ON auth.authId = auth_profile_privilege.authId JOIN privilege ON privilege.privilegeId = auth_profile_privilege.privilegeId JOIN profile ON profile .profileId = auth_profile_privilege.profileId",
        response: "response-user"
      }
    };
    this.connectServ.read(sendData)
  }

  read() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      const changeData = res.data.map(x => {
        const data = {
          tableOne: x.username,
          tableThree: x.displayName,
          tableFour: x.email,
          tableFive: x.address,
          tableSix: x.name,
          tableImage: this.envImageUrl+x.image,
          idOne: x.authProfilePrivilegeId,
          idTwo: x.authId,
          idThree: x.privilegeId,
          idFour: x.profileId,
          image: x.image
        }
        return data;
      });
      this.changeData(changeData);
      this.offlineData(changeData);
    })
  }

  offlineData(changeData) {
    let encryptedKey = CryptoJS.AES.encrypt(
    JSON.stringify('view_user'), this.key, {
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
      JSON.stringify('view_user'), this.key, {
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
    this.router.navigate(['user/detail/'+ convertEncryptedId]);
  }

  dataDelete(ev) {
    const dataRecycleBin = {
      table: 'auth_profile_privilege',
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
      response: "response-delete-auth-profile-privilege",
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
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Deleted data Privilege"
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
          table: "profile",
          tableId: {
            name: "profileId",
            data: ev.idFour
          },
          condition: {
            read: false
          },
          response: "response-delete-profile",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
        },
        {
          table: "auth",
          tableId: {
            name: "authId",
            data: ev.idTwo
          },
          condition: {
            read: false
          },
          response: "response-delete-auth",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
        },
        {
          table: "auth_profile_privilege",
          tableId: {
            name: "authProfilePrivilegeId",
            data: ev.idOne
          },
          condition: {
            read: true
          },
          response: "response-delete-auth-profile-privilege",
          toast: {
            name:  "response-delete-auth-profile-privilege",
            type: 'delete',
            messageToastSuccess: 'Delete data user successfully',
            messageToastError: 'Delete data user not successfully'
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
        table: "auth_profile_privilege",
        joinTable: "JOIN auth ON auth.authId = auth_profile_privilege.authId JOIN privilege ON privilege.privilegeId = auth_profile_privilege.privilegeId JOIN profile ON profile .profileId = auth_profile_privilege.profileId",
        response: "response-user"
      },
      checkImage: {
        table: "profile",
        tableId: {
          name: "image",
          data: ev.image
        },
        response: "response-checkImage-profile"
      },
      uploadOffline: {
        filePath: "user.json"
      },
      upload: {
        beforeImage: ev.image
      }
    };
    if(navigator.onLine) {
      of(this.connectServ.read(sendDataDelete)).pipe(take(1)).subscribe(()=> {
      })
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('delete_user', sendDataDelete);
    }
    
  }

}
