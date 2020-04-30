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
  selector: 'app-view-by-id-user',
  templateUrl: './view-by-id-user.component.html',
  styleUrls: ['./view-by-id-user.component.css']
})
export class ViewByIdUserComponent implements OnInit, OnDestroy {
  tokenCrypto= environment.tokenCrypto;
  key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
  dataUser: any = {};
  privileges: any = [];
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
    this.dataPrivilege();
    this.readPrivilege();
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
    this.connectServ.response$.pipe(take(1)).subscribe(res => {
      this.privileges = res.data;
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
        table: "auth_profile_privilege",
        tableId: {
          name: "authProfilePrivilegeId= ?",
          data: paramsId
        },
        joinTable: "JOIN auth ON auth.authId = auth_profile_privilege.authId JOIN privilege ON privilege.privilegeId = auth_profile_privilege.privilegeId JOIN profile ON profile .profileId = auth_profile_privilege.profileId",
        response: "response-read-by-id-auth-profile-privilege"
      }
    }
    this.connectServ.readTwo(sendDataById)
  }

  read() {
    this.connectServ.responseTwo$.pipe(takeUntil(this.subs)).subscribe(res => {
      let dataLogin = CryptoJS.AES.decrypt(
        res.data[0].password, this.key, {
        keySize: 16,
        iv: this.iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      this.dataUser.name= res.data[0].displayName;
      this.dataUser.username= res.data[0].username;
      this.dataUser.password= JSON.parse(dataLogin).password;
      this.dataUser.email= res.data[0].email;
      this.dataUser.address= res.data[0].address;
      this.dataUser.privilege= res.data[0].privilegeId;
      this.dataUser.auth= res.data[0].authId;
      this.dataUser.profile= res.data[0].profileId;
      this.dataUser.beforeImage= res.data[0].image;
      this.dataUser.image= res.data[0].image;
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
          const id = params.id.toString().replace(/Por21Ld/g, '/');
          let paramsId = CryptoJS.AES.decrypt(
            id, this.key, {
            keySize: 16,
            iv: this.iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          }).toString(CryptoJS.enc.Utf8);
          of(this.dataUpdate(paramsId, res[0].profileId, password)).pipe(takeUntil(this.subs)).subscribe(()=> {
            this.router.navigate(['/user']);
            this.toastr.success('Update data user successfully', 'Done', {
              timeOut: 10000,
              positionClass: 'toast-bottom-center'
            });
          })
        }
      });
    });
    this.connectServ.readDataProfile();
  }

  dataUpdate(paramsId, profileId, password) {
    let sendDataUpdate = {
      numberOfTable: 1,
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
            description: "Updated data Privilege"
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
          table: "auth",
          tableId: {
            name: "authId",
            data: this.dataUser.auth
          },
          data: "username='"+this.dataUser.username+"',password='"+password+"'",
          condition: {
            read: false
          },
          response: "response-delete-auth"
        },
        {
          table: "profile",
          tableId: {
            name: "profileId",
            data: this.dataUser.profile
          },
          data: "displayName='"+this.dataUser.name+"',email='"+this.dataUser.email+"',address='"+this.dataUser.address+"',image='"+this.dataUser.image+"'",
          condition: {
            read: false
          },
          response: "response-delete-auth"
        },
        {
          table: "auth_profile_privilege",
          tableId: {
            name: "authProfilePrivilegeId",
            data: paramsId
          },
          data: "authId='"+this.dataUser.auth+"',privilegeId='"+this.dataUser.privilege+"',profileId='"+this.dataUser.profile+"'",
          condition: {
            read: false
          },
          response: "response-delete-auth-profile-privilege"
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
        table: "auth_profile_privilege",
        joinTable: "JOIN auth ON auth.authId = auth_profile_privilege.authId JOIN privilege ON privilege.privilegeId = auth_profile_privilege.privilegeId JOIN profile ON profile .profileId = auth_profile_privilege.profileId",
        response: "response-user"
      },
      checkImage: {
        table: "profile",
        tableId: {
          name: "image",
          data: this.dataUser.beforeImage
        },
        response: "response-checkImage-profile"
      },
      uploadOffline: {
        filePath: "user.json"
      },
      upload: {
        filePath: this.dataUser.image,
        selectedFile: this.dataUser.selectedFile,
        beforeImage: this.dataUser.beforeImage
      }
    };
    this.connectServ.read(sendDataUpdate)
  }

}
