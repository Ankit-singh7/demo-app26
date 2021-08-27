import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Plugins } from "@capacitor/core";
import { AnimationController, IonInput, ModalController, NavController, Platform, PopoverController } from "@ionic/angular";
import { BasicPopoverComponent } from 'src/app/global-components/basic-popover/basic-popover.component';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { MarketingComponent } from '../marketing/marketing.component';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';

const { Keyboard } = Plugins;
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {

  @Output() toggleSignup = new EventEmitter();
  @Output() navigate = new EventEmitter();
  @Input() navigateMenu: boolean;
  public account = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"),
    ]),
    terms: new FormControl("", [Validators.required, Validators.requiredTrue]),
    marketing: new FormControl(false)
  });
  public isKeyboardOpen = false;
  public accountExists = false;
  public testEmail = "test@test.com";
  public accountSuccessPopover;
  public submitted = false;

  public staticModal;

  @ViewChild('passwordInput') passwordInput: IonInput;


  constructor(
    private platform: Platform,
    private animationController: AnimationController,
    private navController: NavController,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {
    if (Keyboard) {
      Keyboard.addListener("keyboardWillHide", () => {
        this.onKeyboardStateChange(false);
      });
    }
  }

  ngOnInit() {
  }

  goBack() {
    this.navController.pop();
  }
  async createAccount() {
    const accountVal = this.account.value;
    this.submitted = true;
    setTimeout(async () => {
      this.accountExists = await this.checkIfAccountExists(accountVal.email)
      if (!this.accountExists && this.account.valid) {

        // convert email to lower case and send it
        accountVal.email = accountVal.email.toLowerCase()
        
        // create user in backend
        await this.userService.createAccount(accountVal.email, accountVal.password)
        .then(async () => {
          const account = await this.userService.getUser(accountVal.email)
          await this.userService.createAccountNativeStorageSession(account);
          this.accountSuccessPopover = await this.popoverController.create({
            component: BasicPopoverComponent,
            componentProps: {
              text:
                "Account created!",
              icon: "success",
              overflow: false,
            },
            cssClass: "basic-popover",
            mode: "md",
          });
          await this.accountSuccessPopover.present();
          this.goToOrientation();
        })
        .catch((error) => error)

      }
    }, environment.ctaAnimationDelay);
  }

  // query for user in backend
  // we are using emails as usernames
  async checkIfAccountExists(email: string) {
    const account: any = await this.userService.getUser(email)
    return (account && account.resultCount > 0) ? true : false
  }

  goToOrientation() {
    setTimeout(async () => {
      this.accountSuccessPopover.dismiss();
      if(!this.navigateMenu) {
        this.navigate.emit('intro/legal');
      } else {
        this.navigate.emit('');
      }
    }, 2000);
  }

  onKeyboardStateChange(state) {
    if (this.platform.is("cordova")) {
      if (state) {
        this.isKeyboardOpen = true;
        const anim = this.animationController
          .create()
          .addElement(document.querySelector(".content-to-shift"))
          .duration(200)
          .iterations(1)
          .fromTo("transform", "translateY(0px)", "translateY(-135px)");
        anim.play();
      } else {
        this.isKeyboardOpen = false;
        const anim = this.animationController
          .create()
          .addElement(document.querySelector(".content-to-shift"))
          .duration(200)
          .iterations(1)
          .fromTo("transform", "translateY(-135px)", "translateY(0px)");
        anim.play();
      }
    }
    this.cdr.detectChanges();
  }

  async openStaticModal(type: string) {    
    this.staticModal = await this.modalController.create({
      component: type === 'terms-conditions' ? TermsConditionsComponent : MarketingComponent,
      animated: true,
      showBackdrop: false
    });
    this.staticModal.present();
  }

  updateForm() {
    this.submitted = false;
  }

  showSignIn(){
    this.toggleSignup.emit();
  }

  closeKeyboard(event) {
    if (event.key === 'Enter') {
      if (Keyboard) {
        Keyboard.hide();
      }
    }
  }
}
