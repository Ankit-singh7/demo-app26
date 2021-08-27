import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Pet } from '../../../classes/pet';
import { IonContent, PopoverController } from '@ionic/angular';
import { BasicPopoverComponent } from 'src/app/global-components/basic-popover/basic-popover.component';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: 'app-tests',
  templateUrl: 'tests.page.html',
  styleUrls: ['tests.page.scss'],
})
export class TestsPage {
  public popover;
  public registered = false;
  public registerCtaText = 'Interested? Tap here!';
  private comeFromRegisterPopup = false;
  @ViewChild('testsContent') content: IonContent;

  constructor(
    private dataService: DataService,
    private popoverController: PopoverController,
    private trackingService: TrackingService
  ) {

  }

  ionViewDidEnter() {
    if (!this.comeFromRegisterPopup) this.trackingService.trackMe("Screen Viewed");
    this.comeFromRegisterPopup = false // reset for next view
    this.content.scrollToTop();
  }

  ionViewWillEnter() {
    this.dataService.hasRegistered$.subscribe(registered => {
      if(registered) {
        this.registered = true;
        this.registerCtaText = 'Thanks for your interest';
      }
    });
  }

  async registerInterest() {
    this.comeFromRegisterPopup = true
    this.popover = await this.popoverController.create({
      component: BasicPopoverComponent,
      componentProps: {
      icon: 'success',
      text: `Great! Check back early 2021!`,
        ctaText: 'Ok',
      },
      cssClass: 'basic-popover',
      mode: 'md',
    });
    this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "register interest" });

    this.dataService.registered();
    await this.popover.present();
  }
}
