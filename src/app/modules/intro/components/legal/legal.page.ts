import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';

import { SplashScreen } from '@capacitor/splash-screen';
import {StatusBar} from '@capacitor/status-bar'
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-legal',
  templateUrl: './legal.page.html',
  styleUrls: ['./legal.page.scss'],
})
export class LegalPage implements OnInit {
  public signedIn: boolean = false;
  constructor(private navController: NavController, private platform: Platform, private dataService: DataService, private userService: UserService) {
    // if (this.platform.is('ios')) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Light
    //   });
    // }
    this.userService.signedIn$.subscribe((val) => {
      this.signedIn = val;
    })
    this.dataService.onboardingInProgress("intro/legal");
  }

  ngOnInit() {
  }

  navigate() {
    setTimeout(() => {
      this.navController.navigateForward(['intro/guide'])
    }, environment.ctaAnimationDelay);
  }

  goBack() {
    this.navController.navigateRoot(['intro/welcome']);
    // if (this.platform.is('ios')) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Dark
    //   });
    // }
  }
  ionViewDidEnter() {
    SplashScreen.hide();
  }
}
