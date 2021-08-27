import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Plugins } from "@capacitor/core";
import { AnimationController, Platform } from '@ionic/angular';

const { Keyboard } = Plugins;

@Component({
  selector: 'app-password-checker',
  templateUrl: './password-checker.component.html',
  styleUrls: ['./password-checker.component.scss']
})
export class PasswordCheckerComponent implements OnInit {

  @Input() form: FormGroup;
  childFormGroup: FormGroup = new FormGroup({
    password: new FormControl("", [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[A-Z]).{8,}$")])
  })

  public passwordValid = true;
  public showPassword = false;
  public showPasswordHelper = false;
  public passwordType = "password";
  public isKeyboardOpen;

  public checkPatterns = {
    minLength: {
      regex: ".{8,}",
      result: false
    },
    hasUppercase: {
      regex: "[A-Z]{1,}",
      result: false
    },
    hasNumber: {
      regex: "[0-9]{1,}",
      result: false
    },
  };

  constructor(private platform: Platform, private animationController: AnimationController, private cdr: ChangeDetectorRef) {
    if (Keyboard) {
      Keyboard.addListener("keyboardWillHide", () => {
        this.onKeyboardStateChange(false);
      });
    }
  }

  ngOnInit() {
    this.childFormGroup.addControl("password", new FormControl("", [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[A-Z]).{8,}$")]));
    this.form.addControl("password", this.childFormGroup.controls["password"]);
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
        this.showPasswordHelper = true;
      } else {
        this.isKeyboardOpen = false;
        const anim = this.animationController
          .create()
          .addElement(document.querySelector(".content-to-shift"))
          .duration(200)
          .iterations(1)
          .fromTo("transform", "translateY(-135px)", "translateY(0px)");
        anim.play();
        this.showPasswordHelper = false;
      }
    }
    this.cdr.detectChanges();
  }

  checkPassword(e) {
    this.passwordValid = true;
    this.checkPatterns.minLength.result = new RegExp(this.checkPatterns.minLength.regex).test(e.detail.value);
    this.checkPatterns.hasUppercase.result = new RegExp(this.checkPatterns.hasUppercase.regex).test(e.detail.value);
    this.checkPatterns.hasNumber.result = new RegExp(this.checkPatterns.hasNumber.regex).test(e.detail.value);
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

  validatePassword(){
    this.showPasswordHelper = false;
    if( this.form.get('password').invalid && this.form.get('password').touched && !this.form.get('password').hasError('required') ){
      this.passwordValid = false;
    }
  }
  closeKeyboard(event) {
    if (event.key === 'Enter') {
      if (Keyboard) {
        Keyboard.hide();
      }
    }
  }
}
