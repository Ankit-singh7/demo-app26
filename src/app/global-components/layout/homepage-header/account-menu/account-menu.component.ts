import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { TutorialModal } from 'src/app/modules/homepage-tabs/tracker/tutorial/tutorial.modal';
import { DataService } from "src/app/services/data.service";
import { UserService } from "src/app/services/user.service";
import { SignInPage } from '../../../../modules/sign-in/sign-in.page';

@Component({
  selector: "app-account-menu",
  templateUrl: "./account-menu.component.html",
  styleUrls: ["./account-menu.component.scss"],
})
export class AccountMenuComponent implements OnInit {
  public tutorialModal;
  public signInModal;
  public signedIn = false;

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private userService: UserService,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    // check if user exists in storage (if logged in)
    
    this.userService.signedIn$.subscribe(async signedIn => {
      this.signedIn = signedIn;
    });
    
    // test API
    // try {
    //   const token = await this.userService.getToken().toPromise()
    //   console.log(token)
    // } catch (error) {
    //   console.log(error)
    // }
  }

  navigate(route) {
    this.navController.navigateForward([route]);
  }
  async openTutorial() {
    this.tutorialModal = await this.modalController.create({
      component: TutorialModal,
      animated: true,
      showBackdrop: false,
    });
    this.tutorialModal.present();
  }

  async showSignIn(showRegistration: boolean = false) {
    this.signInModal = await this.modalController.create({
      component: SignInPage,
      animated: true,
      showBackdrop: false,
      componentProps: {
        register: showRegistration,
        navigateMenu: true
      }
    });
    this.signInModal.present();
  }

  async signOut() {
    await this.userService.signOut()
    this.navController.navigateForward(['intro']);
  }

  clearData() {
    this.dataService.clearALLData()
  }
}
