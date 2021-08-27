import { Injectable } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { InfoErrorPopoverComponent } from '../global-components/info-error-popover/info-error-popover.component';
import * as Sentry from '@sentry/angular';

@Injectable({
  providedIn: 'root',
})
export class InfoErrorModalService {
  constructor(private popoverController: PopoverController, private navController: NavController) {}

  public async displayModal(
    modalType:string = "error", 
    text:string = "Something went wrong, but like a lost tennis ball we can’t seem to spot it! Please try again.", 
    navigateType:string = undefined, 
    navigateUrl:string = undefined
  ) {
    Sentry.captureMessage(text);
    const modal = await this.popoverController.create({
      component: InfoErrorPopoverComponent,
      componentProps: {
        text,
        modalType,
        ctaText: "OK"
      },
      cssClass: 'warning-popover',
      mode: 'md'
    })
    await modal.present()
    modal.onDidDismiss().then(
      () => {
        if (navigateType === "back") { this.navController.back() }
        else if (navigateType === "forward" && navigateUrl) { this.navController.navigateRoot([ navigateUrl ]) }
      }
    )
  }
}