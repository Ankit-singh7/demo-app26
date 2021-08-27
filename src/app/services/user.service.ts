import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-enterprise/nativestorage/ngx";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { InfoErrorModalService } from "./infoErrorModal.service";
import {Http} from '@capacitor-community/http';
import {from} from 'rxjs';
import {map} from 'rxjs/operators'

import { isPlatform, Platform } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _imdToken: any;
  private _authIdForPasswordReset: any;
  private _tokenId: any;
  public errorMessages = {
    general: "Something went wrong",
  };
  private _signedIn = new BehaviorSubject<boolean>(false);
  public signedIn$ = this._signedIn.asObservable();
  private _currentSignedInUser = new BehaviorSubject<any>(null);
  public currentSignedInUser$ = this._currentSignedInUser.asObservable();

  constructor(private http: HttpClient, private nativeStorage: NativeStorage, private infoErrorModal: InfoErrorModalService, private platform: Platform) {}

  // IDM API

  // Get token
  async getToken() {

     const body = "grant_type=client_credentials&client_id=idm-provisioning&client_secret=openidm&scope=fr%3Aidm%3A*";

     try {
      const headers = { "Content-Type": "application/x-www-form-urlencoded"};

      //  this.getRequest("https://ciam-sb.mars.com/auth/oauth2/realms/root/realms/Miome/access_token",body,headers)
 
    
    
    this._imdToken = await this.http.post("https://cors.bridged.cc/https://ciam-sb.mars.com/auth/oauth2/realms/root/realms/Miome/access_token", body , { headers }).toPromise();
    }
    catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }

  }



  // Get user detailed information
  async getUser(username: string) {
    const headers = {
      Authorization: `Bearer ${this._imdToken.access_token}`,
      "Accept-API-Version": "protocol=2.1",
    };

    try {
      const response = await this.http.get(`https://ciam-sb.mars.com/identity/managed/MiomeUser?_queryFilter=userName eq "${username}"&_fields=/*&_totalPagedResultsPolicy=NONE`, { headers }).toPromise();
      return response;
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }


//  async getRequest(url,body2,headers){

//     console.log(isPlatform('android'))
//     console.log(isPlatform('ios'))
//     if(isPlatform('android') || isPlatform('ios') || isPlatform('cordova') || isPlatform('capacitor')) {
//       console.log('here in')
//        return await Http.request({
//            method: "POST",
//            url:url,
//            data: {
//             body: "grant_type=client_credentials&client_id=idm-provisioning&client_secret=openidm&scope=fr%3Aidm%3A*"
//            },
//            headers: { "Content-Type": "application/x-www-form-urlencoded" }
//        }).then((result) => {
//           console.log('in then')
//           // console.log(result)
//           this._imdToken = JSON.stringify(result)
//           alert(this._imdToken)
//           alert(this._imdToken.access_token)
//        }).catch((err) => {
//          console.log('error')
//          console.log(err)
//        })
//     } else {
//       console.log('here')
//        return this.http.post("/api/auth/oauth2/realms/root/realms/Miome/access_token",body2,headers)
//     }
//   }

  // Register new account
  async createAccount(email: string, password: string) {
    const headers = {
      Authorization: `Bearer ${this._imdToken.access_token}`,
      "Accept-API-Version": "protocol=2.1",
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      userName: email,
      givenName: email,
      sn: email,
      mail: email,
      preferences: { marketing: false, updates: false },
      password: password,
    });

    try {
      const response = await this.http.post("https://ciam-sb.mars.com/identity/managed/MiomeUser", body, { headers }).toPromise();
      this._signedIn.next(true);
      return response;
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
      throw false;
    }
  }

  // Sign in user
  async signIn(username: string, password: string) {
    const headers = {
      Authorization: `Basic ${environment.MARS_ENV}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const body = `grant_type=password&scope=openid%20profile&username=${username}&password=${password}`;
    try {
       await this.http.post("https://cors.bridged.cc/https://ciam-sb.mars.com/auth/oauth2/realms/root/realms/Miome/access_token", body, { headers }).toPromise();
       this._signedIn.next(true);
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
      throw error;
    }
  }

  // Session calls (NativeStorage)
  async createAccountNativeStorageSession(user: any) {
    try {
      await Promise.all([
        this.nativeStorage.setItem("activeUser", user.result[0]),
        this.nativeStorage.setItem("userInApp", true),
      ]);
      this._signedIn.next(true)
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }

  async getAccountFromNativeStorageSession() {
    try {
      const user = await this.nativeStorage.getItem("activeUser");
      if (user) {
        this._signedIn.next(true);
        return user;
      } else {
        return false;
      }
    } catch (error) {
      if (error.code !== 2) {
        this.infoErrorModal.displayModal("error", this.errorMessages.general);
      } else {
        return false;
      }
    }
  }

  // RESET PASSWORD API
  async resetPasswordInit() {
    const headers = { "Accept-API-Version": "resource=2.0, protocol=1.0" };
    const body = {};
    try {
      const response: any = await this.http.post("https://ciam-sb.mars.com/auth/json/realms/root/realms/Miome/authenticate?authIndexType=service&authIndexValue=ChangePasswordOTP", body, { headers }).toPromise();
      this._authIdForPasswordReset = response.authId;
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }

  async resetPasswordSendEmail(email: string) {
    const headers = {
      "Accept-API-Version": "resource=2.0, protocol=1.0",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      authId: this._authIdForPasswordReset,
      callbacks: [
        {
          type: "StringAttributeInputCallback",
          input: [
            { name: "IDToken1", value: email },
            { name: "IDToken1validateOnly", value: false },
          ],
          output: [
            { name: "name", value: "mail" },
            { name: "prompt", value: "Email" },
            { name: "required", value: false },
            { name: "policies", value: {} },
            { name: "failedPolicies", value: [] },
            { name: "validateOnly", value: false },
            { name: "value", value: "" },
          ],
          _id: 0,
        },
      ],
    });

    try {
      const response: any = await this.http.post("https://ciam-sb.mars.com/auth/json/realms/root/realms/Miome/authenticate?authIndexType=service&authIndexValue=ChangePasswordOTP", body, { headers }).toPromise();
      this._authIdForPasswordReset = response.authId;
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }

  async resetPasswordVerifyCode(code: string) {
    const headers = {
      "Accept-API-Version": "resource=2.0, protocol=1.0",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      authId: this._authIdForPasswordReset,
      callbacks: [{ type: "PasswordCallback", output: [{ name: "prompt", value: "One Time Password" }], input: [{ name: "IDToken1", value: code.toString() }] }],
    });

    try {
      const response: any = await this.http.post("https://ciam-sb.mars.com/auth/json/realms/root/realms/Miome/authenticate?authIndexType=service&authIndexValue=ChangePasswordOTP", body, { headers }).toPromise();
      this._authIdForPasswordReset = response.authId;
    } catch (error) {
      throw error;
    }
  }

  async resetPasswordSendNewPassword(newPassword: string) {
    const headers = {
      "Accept-API-Version": "resource=2.0, protocol=1.0",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      authId: this._authIdForPasswordReset,
      callbacks: [
        {
          type: "ValidatedCreatePasswordCallback",
          input: [
            { name: "IDToken1", value: newPassword },
            { name: "IDToken1validateOnly", value: false },
          ],
          output: [
            { name: "echoOn", value: false },
            { name: "policies", value: {} },
            { name: "failedPolicies", value: [] },
            { name: "validateOnly", value: false },
            { name: "prompt", value: "Password" },
          ],
          _id: 1,
        },
      ],
    });

    try {
      const response: any = await this.http.post("https://ciam-sb.mars.com/auth/json/realms/root/realms/Miome/authenticate?authIndexType=service&authIndexValue=ChangePasswordOTP", body, { headers }).toPromise();
      this._tokenId = response.tokenId;
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
      throw error;
    }
  }

  // UTILS
  async signOut() {
    this._signedIn.next(false);
  }

  async clearUserAccount(account) {
    // clear all session keys
    await this.nativeStorage.clear();

    // delete user from IDM backend
    const id = account._id;
    const headers = {
      "Accept-API-Version": "protocol=2.1,resource=1.0",
      Authorization: `Bearer ${this._imdToken}`,
      "If-Match": "*",
      "Content-Type": "application/json",
    };

    try {
      return await this.http.delete(`https://ciam-sb.mars.com/identity/managed/MiomeUser/${id}`, { headers }).toPromise();
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }

  async clearUserData() {
    try {
      await Promise.all([this.nativeStorage.remove("currentPet"), this.nativeStorage.remove("onboardingQuestion"), this.nativeStorage.remove("onboardingInProgress"), this.nativeStorage.remove("toggle-poop-details"), this.nativeStorage.remove("takenRecord"), this.nativeStorage.remove("pets"), this.nativeStorage.remove("user_first_seen")]);
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }

  async checkIfUserInApp() {
    try {
      return await this.nativeStorage.getItem("userInApp");
    } catch (error) {
      if (error.code !== 2) {
        this.infoErrorModal.displayModal("error", this.errorMessages.general);
      } else {
        return false;
      }
    }
  }
}
