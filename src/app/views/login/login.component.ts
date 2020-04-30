import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dataLogin: any = {};
  loading = false;
  tokenCrypto= environment.tokenCrypto;
  constructor(
    private loginServ: LoginService
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.loading = true;
    let _key = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenCrypto);
    let encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(this.dataLogin), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const dataLogin = {
      username: this.dataLogin.username,
      password: encrypted.toString()
    };
    this.data(dataLogin);
  }

  data(dataLogin) {
    let sendData = {
      numberOfTable: 1,
      action: {
        table: 'login',
        upload: false,
        join: true,
      },
      readById: {
        table: "auth_profile_privilege",
        tableId: {
          name:  "username = ? AND password = ?",
          data: [dataLogin.username, dataLogin.password]
        },
        joinTable: "JOIN auth ON auth.authId = auth_profile_privilege.authId JOIN profile ON profile.profileId = auth_profile_privilege.profileId JOIN privilege ON privilege.privilegeId = auth_profile_privilege.privilegeId",
        response: "response-login"
      }
    };
    this.loginServ.loginData(sendData);
  }

}
