import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { BasicPopoverComponent } from 'src/app/global-components/basic-popover/basic-popover.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})

export class PasswordResetComponent implements OnInit {
  @Input() email: string;

  public resetCode= new FormGroup({
    code: new FormControl("", [
      Validators.required, Validators.pattern("^(?=.*[0-9]).{8}$")
    ])
  });

  public resetPassword = new FormGroup({});
  public codeConfirmed: boolean = false;
  public passwordPopover;
  public invalidCode: boolean = false;

  constructor(private modalController: ModalController, private popoverController: PopoverController, private userService: UserService) {}

  ngOnInit() {
  }

  goBack() {
    this.modalController.dismiss();
  }
  async submitCode() {
    await this.userService.resetPasswordVerifyCode(this.resetCode.get('code').value)
    .then(() => {
      this.codeConfirmed = true;
    })
    .catch((error) => {error})
  }

  async submitPassword() {
    await this.userService.resetPasswordSendNewPassword(this.resetPassword.get('password').value)
    .then(async () => {
      this.invalidCode = false;
      this.passwordPopover = await this.popoverController.create({
        component: BasicPopoverComponent,
        componentProps: {
          icon: "success",
          text: "Password changed",
          ctaText: "Ok",
          callback: this.closeModal.bind(this)
        },
        cssClass: "basic-popover",
        mode: "md",
      });
      await this.passwordPopover.present();  
    })
    .catch((error) => {
      this.invalidCode = true;
    })
  }

  async closeModal() {
    await this.passwordPopover.dismiss();
    await this.modalController.dismiss();
  }
}
