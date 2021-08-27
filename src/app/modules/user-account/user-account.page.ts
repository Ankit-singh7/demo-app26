import { Component, OnInit } from "@angular/core";
import { ModalController, NavController, PopoverController } from "@ionic/angular";
import { BasicPopoverComponent } from "src/app/global-components/basic-popover/basic-popover.component";
import { WarningPopoverComponent } from "src/app/global-components/warning-popover/warning-popover.component";
import { UserService } from "src/app/services/user.service";
import { PasswordResetComponent } from "./password-reset/password-reset.component";

@Component({
  selector: "app-user-account",
  templateUrl: "./user-account.page.html",
  styleUrls: ["./user-account.page.scss"],
})
export class UserAccountComponent implements OnInit {
  public user: any;
  public accountActionPopover;
  public accountActionModal;

  constructor(private userService: UserService, private popoverController: PopoverController, private modalController: ModalController, private navController: NavController) {}

  async ngOnInit() {
    this.user = await this.userService.getAccountFromNativeStorageSession();
  }

  async openModal(intent: string) {
    switch (intent) {
      case "reset-password":
        this.accountActionPopover = await this.popoverController.create({
          component: WarningPopoverComponent,
          componentProps: {
            icon: "missing",
            text: `Send a password reset email to ${this.user.mail}?<br/><br/>You will receive a unique code to verify your identity.`,
            cancelText: "Cancel",
            confirmText: "Send code",
            callback: this.goToPasswordReset.bind(this)
          },
          cssClass: "warning-popover",
          mode: "md",
        });
        await this.accountActionPopover.present();
        break;
      case "delete-data":
        this.accountActionPopover = await this.popoverController.create({
          component: BasicPopoverComponent,
          componentProps: {
            icon: "error",
            text: "Are you sure you want to delete all of your data? This cannot be undone.",
            ctaTextAlt: "Cancel",
            ctaText: "Ok",
            callback: this.clearUser.bind(this, "data"),
          },
          cssClass: "basic-popover",
          mode: "md",
        });
        await this.accountActionPopover.present();
        break;
      case "delete-account":
        this.accountActionPopover = await this.popoverController.create({
          component: BasicPopoverComponent,
          componentProps: {
            icon: "error",
            text: "Are you sure you want to delete your account? This will also delete all of your data. This cannot be undone.",
            ctaTextAlt: "Cancel",
            ctaText: "Ok",
            callback: this.clearUser.bind(this, "account"),
          },
          cssClass: "basic-popover",
          mode: "md",
        });
        await this.accountActionPopover.present();
        break;

      default:
        break;
    }
  }

  async clearUser(type: string) {
    this.accountActionPopover.dismiss();
    
    type === "data" ? await this.userService.clearUserData() : await this.userService.clearUserAccount(this.user);
    this.accountActionPopover = await this.popoverController.create({
      component: BasicPopoverComponent,
      componentProps: {
        icon: "success",
        text: `${type === "data" ? "All data deleted" : "Account and data deleted"}`,
        ctaText: "Ok",
      },
      cssClass: "basic-popover",
      mode: "md",
    });
    await this.accountActionPopover.present();
    type === "data" ? this.navController.navigateForward(["details"]) : this.navController.navigateForward(["intro"]);
  }

  async goToPasswordReset() {
    await this.accountActionPopover.dismiss();
    this.accountActionModal = await this.modalController.create({
      component: PasswordResetComponent,
      componentProps: {
        email: this.user?.mail
      }
    })
    await this.userService.resetPasswordInit();
    await this.userService.resetPasswordSendEmail(this.user?.mail);
    this.accountActionModal.present();
  }
}
