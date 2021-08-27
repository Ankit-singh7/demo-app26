import { Injectable } from '@angular/core';
// import { Network } from '@ionic-native/network/ngx';
// import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  
  // disconnectSub: Subscription;
  // connectSub: Subscription;
  // private connected: boolean;
  // constructor(private network: Network) { }
  // init() {
  //   this.disconnectSub = this.network.onDisconnect().subscribe(() => {
  //     this.connected = false
  //     // offline code...
  //   });

  //   this.connectSub = this.network.onConnect().subscribe(() => {
  //     this.connected = true
  //     setTimeout(() => {
  //       // online code...
  //       //this.network.type = '3g' || '4g' || 'wifi'
  //     }, 5000); // 5s wait for network to become active
  //   });
  // }

  // get isConnected() { return this.connected }
}