import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnDestroy {
  dataUser: any = {};
  privileges: any = [];
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
    this.dataUser.image = 'assets/img/avatars/placeholder.jpg';
    this.dataPrivilege();
    this.readPrivilege();
    this.dataUser.privilege = 0;
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
  }

  dataPrivilege() {
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

  readPrivilege() {
    this.connectServ.response$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.privileges = res.data;
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
      if (this.dataUser.privilege != 0) {
        if(this.selectedFile) {
          this.dataUser.selectedFile = this.selectedFile;
          this.dataUser.image = this.selectedFile.name;
        } else {
          this.dataUser.image = 'placeholder.jpg';
        }
        const user = {
          username: this.dataUser.username,
          password: this.dataUser.password
        }
        let encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(user), this.key, {
            keySize: 16,
            iv: this.iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
        let password =  encrypted.toString();
        of(this.data(res[0].profileId, password)).pipe(takeUntil(this.subs)).subscribe(()=> {
          this.router.navigate(['/user']);
        })
      }
    })
    this.connectServ.readDataProfile();
  }

  data(profileId, password) {
    let sendData = {
      numberOfTable: 1,
      response: "response-add-auth-profile-privilege",
      action: {
        table: 'add',
        upload: true,
        join: true,
        createDataOffline: true
      },
      create: [
        {
          table:"auth",
          data: {
            username: this.dataUser.username,
            password: password,
          },
          condition: {
            read: false,
            insertId: true,
            processAddJoin: true,
            addMultiJoin: false,
          },
          response: "response-add-auth",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
          result: null,
          sendCreateJoinId: {
            key: 1,
            name: "authId"
          }
        },
        {
          table:"profile",
          data: {
            displayName: this.dataUser.name,
            email: this.dataUser.email,
            address: this.dataUser.address,
            image: this.dataUser.image,
          },
          condition: {
            read: false,
            insertId: true,
            processAddJoin: true,
            addMultiJoin: false,
          },
          response: "response-add-profile",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
          result: null,
          sendCreateJoinId: {
            key: 1,
            name: "profileId"
          }
        },
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Added data User"
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
          table: "auth_profile_privilege",
          data: {
            privilegeId: this.dataUser.privilege
          },
          condition: {
            read: true,
            insertId: false
          },
          response: "response-add-auth-profile-privilege",
          toast: {
            name:  "response-add-auth-profile-privilege",
            type: 'add-join',
            messageToastSuccess: 'Added data user successfully',
            messageToastError: 'Added data user not successfully'
          },
        }
      ],
      read: {
        table: "auth_profile_privilege",
        joinTable: "JOIN auth ON auth.authId = auth_profile_privilege.authId JOIN privilege ON privilege.privilegeId = auth_profile_privilege.privilegeId JOIN profile ON profile .profileId = auth_profile_privilege.profileId",
        response: "response-user"
      },
      uploadOffline: {
        filePath: "user.json"
      },
      upload: {
        filePath: this.dataUser.image,
        selectedFile: this.dataUser.selectedFile,
        base64: this.imgURL
      }
    };
    if(navigator.onLine) {
      this.connectServ.read(sendData)
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('add_user', sendData);
    }
  }

  goToList(){
    this.router.navigate(['user']);
  } 

}
