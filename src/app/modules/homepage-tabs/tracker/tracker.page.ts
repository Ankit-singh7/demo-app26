import { PoopSample } from "./../../../interfaces/poopSample";
import { Component, ChangeDetectorRef, ViewChild } from "@angular/core";
import { IonContent, ModalController, NavController, PopoverController } from "@ionic/angular";
import {StatusBar} from '@capacitor/status-bar'
import { SplashScreen } from "@capacitor/splash-screen";
import { Platform } from "@ionic/angular";
import { DataService } from "src/app/services/data.service";
import { Pet } from '../../../classes/pet';
import { BasicPopoverComponent } from 'src/app/global-components/basic-popover/basic-popover.component';
import { environment } from 'src/environments/environment';
import { TutorialModal } from './tutorial/tutorial.modal';
import { InfoErrorModalService } from 'src/app/services/infoErrorModal.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { Subject } from "rxjs";
import { debounceTime } from 'rxjs/operators';
// const { StatusBar, SplashScreen, StatusBarStyle } = Plugins;

@Component({
  selector: "app-tracker",
  templateUrl: "tracker.page.html",
  styleUrls: ["tracker.page.scss"],
})
export class TrackerPage {
  public imageUrl: string;
  public todaysDate = new Date().toDateString();
  public data: PoopSample[] = [];
  public date: string;
  public showDetails: boolean = true;
  public showToggle: boolean = false;
  public takenRecord: boolean = false;
  public tellUsMoreDismissed: boolean = false;
  public dismissPopover;
  public tutorialModal;
  public petImage = "../../../../assets/tracker/tell-us-more-icon.png";
  customPopoverOptions: any = {
    cssClass: "dropdown-popover",
  };

  @ViewChild('toggle') toggleRef: any;
  @ViewChild('trackerContent') content: IonContent;

  public petName = ""
  constructor(
    private navController: NavController,
    private platform: Platform,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private infoErrorModal: InfoErrorModalService,
    private trackingService: TrackingService
  ) {
    this.date = "days";
    this.dataService.currentPet$.subscribe((pet: Pet) => { // subscribe for when current pet changes
      this.petName = pet.name;
      if (pet.picture) { this.petImage = `${pet.picture}?${+new Date()}`; }
      this.tellUsMoreDismissed = pet.tellUsMoreComplete;
      this.refreshData() // refresh data if the pet has changed
    });

    this.dataService.hasTakenRecord$.subscribe(takenRecord => {
      this.takenRecord = takenRecord;
    });
  }

  ionViewDidEnter() {
    this.content.scrollToTop();
    this.trackingService.trackMe("Screen Viewed");
    SplashScreen.hide()
  }

  ionViewWillEnter() {
    //force remove arrows from ion-select for older iphone devices
    this.dataService.getToggleVar()
    .then((toggle: boolean) => {
      this.showDetails = toggle;
      this.showToggle = true;
    })
    .catch(() => {
      this.dataService.setToggleVar(this.showDetails)
      .then(() => {
        this.showToggle = true;
      });
    });

    const ionSelects = document.querySelectorAll("ion-select");
    ionSelects.forEach((sel) => {
      sel.shadowRoot.querySelectorAll(".select-icon-inner").forEach((elem) => {
        elem.setAttribute("style", "display: none;");
      });
    });

    // if (this.platform.is("ios")) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Dark,
    //   });
    // }
    this.refreshData();
  }
  haveTodaysData() {
    if (this.data?.length > 0) {
      if (this.data[0].date === this.todaysDate) return true;
      return false;
    }
    return false;
  }
  capture() {
    this.navController.navigateRoot(["camera"]);
  }

  refreshData(e = null) {
    this.dataService
      .getPoopData()
      .then((poopData: PoopSample[]) => {
        if (e) e.target.complete();
        this.data = poopData;
      })
      .catch(() => this.infoErrorModal.displayModal("error", "Error refreshing data"));
      this.date = "days";
  }

  formatDay(date) {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    return `${this.addDaySuffix(day)}`;
  }

  addDaySuffix(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

  toggleDetails(e = null) {
    this.showDetails = e.detail.checked;
    this.cdr.detectChanges();
    this.dataService.setToggleVar(e.detail.checked);
    this.trackingService.trackMe("Poop Details Toggled", { "Status": this.showDetails ? "on" : "off" })
  }

  goToTellUsMore() {
    this.navController.navigateForward(["tell-us-more"]);
  }

  async dismissTellUsMoreBanner(e) {
    e.stopPropagation();
    this.dismissPopover = await this.popoverController.create({
      component: BasicPopoverComponent,
      componentProps: {
        text: `You can still tell us more about ${this.petName} within the ‘Pets’ section of this app`,
        ctaText: "Got it"
      },
      cssClass: "basic-popover",
      mode: "md"
    })
    await this.dismissPopover.present();
    this.dataService.updatePetData('tellUsMoreComplete', true);
  }

  async howDoesThisWork() {
    await setTimeout(async () => {
      this.tutorialModal = await this.modalController.create({
        component: TutorialModal,
        animated: true,
        showBackdrop: false
      });
      this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "how it works" });
      await this.tutorialModal.present()
      this.tutorialModal.onDidDismiss().then(() => {
        this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "tracker" });
      })
    }, environment.ctaAnimationDelay);
  }
}
