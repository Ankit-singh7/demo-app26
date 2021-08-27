import { Component, Input, NgZone, OnInit } from '@angular/core';
import { NavController, ModalController, Platform } from '@ionic/angular';

import { environment } from '../../../environments/environment';
import { StatusBar } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';



@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  public signUp = true;
  @Input() register: boolean;
  @Input() navigateMenu: boolean;
  public isKeyboardOpen: boolean = false;
  constructor(
    private navController: NavController,
    public viewCtrl: ModalController,
    private platform: Platform,
    private ngZone: NgZone
  ) {
    Keyboard.addListener('keyboardWillHide', () => this.ngZone.run(() => this.isKeyboardOpen = false));
    Keyboard.addListener('keyboardWillShow', () => this.ngZone.run(() => this.isKeyboardOpen = true));
  }

  ngOnInit() {
    if (this.register) {
      this.toggleSignUp();
    }
    // if (this.platform.is('ios')) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Light
    //   });
    // }

  }

  toggleSignUp() {
    this.signUp = !this.signUp;
  }

  navigate(route: string = '') {
    if (route != '') {
      this.navController.navigateForward([route]).then(() => {
        setTimeout(() => {
          this.dismissModal();
        }, 500);
      });
    } else {
      setTimeout(() => {
        this.dismissModal();
      }, 500);
    }
  }

  dismissModal() {
    this.viewCtrl.dismiss();
    // if (this.platform.is('ios')) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Dark
    //   });
    // }
  }

}
