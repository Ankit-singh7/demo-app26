// import { DataService } from 'src/app/services/data.service';
// import { UserService } from './../../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { InfoErrorModalService } from 'src/app/services/infoErrorModal.service';
import { DataService } from 'src/app/services/data.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { SignInPage } from '../../../sign-in/sign-in.page';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';


@Component({
  selector: 'intro-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss']
})
export class WelcomePage implements OnInit {

  public isSignedIn = false;
  private signInModal;

  constructor(
    // private alertController: AlertController,
    private navController: NavController,
    private platform: Platform,
    // private toastService: ToastService,
    // private userService: UserService,
    // private dataService: DataService
    private router: Router,
    private dataService: DataService,
    private infoErrorModal: InfoErrorModalService,
    private trackingService: TrackingService,
    private modalController: ModalController,
    private userService: UserService
  ) {
    // this.userService.isSignedIn.subscribe(val => this.isSignedIn = val)
    // if (this.platform.is('ios')) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Dark
    //   });
    // }
  }

  async ngOnInit() {
    try {
      this.isSignedIn = await this.userService.checkIfUserInApp()
    } catch (error) {
      this.infoErrorModal.displayModal("error", "Something went wrong!");
    }
  }

  navigate(route) {
    setTimeout(() => {
      this.navController.navigateForward([route]);
    }, environment.ctaAnimationDelay);
  }

  async showSignIn(showRegistration: boolean = false) {
    this.signInModal = await this.modalController.create({
      component: SignInPage,
      animated: true,
      showBackdrop: false,
      componentProps: {
        register: showRegistration,
        navigateMenu: false
      }
    });
    this.signInModal.present();
  }

  async signInPrompt() {
    setTimeout(() => {
      this.infoErrorModal.displayModal('error', 'This isn\'t working yet, sorry!');
    }, environment.ctaAnimationDelay);
  }

  //   await alert.present();
  // }
  // signIn(inputData) {
  //   const { username, password } = inputData
  //   this.userService.signIn(username, password)
  //   .then(response => this.toastService.showToast(response))
  //   .catch(err => this.toastService.showToast(err))
  // }
  // createAccount() {
  //   this.toastService.showToast("Account creation isn't working yet, sorry!")
  // }

  clearAllData() {
    this.dataService.clearALLData().then(() => alert('done'));
  }

  ionViewDidEnter() {
    SplashScreen.hide();
    this.trackingService.trackMe('Screen Viewed');
  }
}
