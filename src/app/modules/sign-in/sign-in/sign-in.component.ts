import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AnimationController, NavController, Platform } from "@ionic/angular";
import { Plugins } from "@capacitor/core";
import { environment } from "src/environments/environment";
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';

const { Keyboard } = Plugins;
@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit {

  @Output() toggleSignup = new EventEmitter<boolean>();
  @Output() navigate = new EventEmitter();

  public signInForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"),
    ]),
    password: new FormControl("", [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[A-Z]).{8,}$")]),
  });

  public isKeyboardOpen = false;
  public showPassword = false;
  public invalidPassword = false;
  public foundEmail = false;
  public testEmail = "test@test.com";
  public user = {
    email: "test@test.com",
    password: "Testing123",
  };
  public passwordType = "password";
  public submitted = false;

  constructor(
    private platform: Platform,
    private animationController: AnimationController,
    private navController: NavController,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private dataService: DataService
  ) {
    if (Keyboard) {
      Keyboard.addListener("keyboardWillHide", () => {
        this.onKeyboardStateChange(false);
      });
    }
  }

  ngOnInit() {
  }

  onKeyboardStateChange(event) {
    if (this.platform.is("cordova")) {
      if (event) {
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

  // api endpoint throws CORS
  // work around that, create session in storage and lookup from api query user
  async signIn() {
    // get user info from storage and compare
    const userValidated = await this.checkIfAccountExists(this.signInForm.value)
    this.submitted = true;
    if (userValidated && this.signInForm.valid) {
      await this.userService.signIn(this.signInForm.value.email, this.signInForm.value.password)
      .then(async () => {
        const account = await this.userService.getUser(this.signInForm.value.email);
        await this.userService.createAccountNativeStorageSession(account);
        this.dataService.getPets()
        .then(() => {
          this.goToScreen('homepage-tabs/tracker');
        })
        .catch(() => {
          this.goToScreen('intro/legal');
        })
      })
      .catch((error) => {
        this.invalidPassword = true;
      });
    } else {
      this.signInForm.markAllAsTouched();
    }
  }

  async checkIfAccountExists(formValue) {
    const account: any = await this.userService.getUser(formValue.email)
    if (account && account.resultCount > 0) this.foundEmail = true
    return (account && account.resultCount > 0) ? true : false
  }

  goToScreen(route: string) {
    setTimeout(() => {
      this.navigate.emit(route);
    }, environment.ctaAnimationDelay);
  }

  togglePassword(e) {
    if(!this.isKeyboardOpen) {
      this.showPassword = !this.showPassword;
      this.passwordType = this.showPassword ? "text" : "password";
    } else {
      if (e.offsetX <= (e.view.innerWidth - 50) && e.offsetX >= (e.view.innerWidth - 100)) {
        this.showPassword = !this.showPassword;
        this.passwordType = this.showPassword ? "text" : "password";
      }
    }
  }

  updateForm() {
    //reset boolean if user interacts with fields as it is no longer in a submitted state
    this.submitted = false;
  }

  showRegister(){
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
