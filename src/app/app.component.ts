// import { DataService } from 'src/app/services/data.service';
// import { NetworkService } from './services/network.service';
import { Component, NgZone } from "@angular/core";

import { ScreenOrientation } from "@ionic-enterprise/screen-orientation/ngx";
import { NavController, Platform } from "@ionic/angular";
import { resolve } from "dns";
import { DataService } from "./services/data.service";
import { TrackingService } from "./services/tracking.service";
import { UserService } from "./services/user.service";
import { Keyboard } from "@capacitor/keyboard";


@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  public hideFloatingButtons = false;
  private onLoadChecked = false;
  constructor(
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private dataService: DataService,
    private navController: NavController,
    private trackingService: TrackingService,
    // private networkService: NetworkService,
    // private dataService: DataService,
    private ngZone: NgZone,
    private userService: UserService
  ) {
    Keyboard.addListener("keyboardWillHide", () => this.ngZone.run(() => (this.hideFloatingButtons = false)));
    Keyboard.addListener("keyboardWillShow", () => this.ngZone.run(() => (this.hideFloatingButtons = true)));
    this.initializeApp();
  }

  initializeApp() {
     this.platform.ready().then( async () => {
      this.trackingService.trackMe("App Opened");
      // this.networkService.init()
      const userSignedIn = await this.userService.getAccountFromNativeStorageSession();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.dataService.onboardingInProgress$.subscribe(async (progressState) => {
        // if (!this.onLoadChecked) {
          if (progressState) {  
            this.navController.navigateRoot([progressState]);
          } else {
            this.dataService.isOnboardingComplete$.subscribe((isOnboardingComplete) => {
              if (isOnboardingComplete || userSignedIn) {
                this.navController.navigateRoot(["homepage-tabs/tracker"]);
              } else {
                this.navController.navigateRoot(["intro/welcome"]);
              }
            });
          }
        // }

      });
          // on init grab a token
          this.userService.getToken();
      // this.dataService.listenForSignIn()
    });
  }
}
