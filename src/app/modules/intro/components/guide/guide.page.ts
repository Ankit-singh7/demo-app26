import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { TrackingService } from '../../../../services/tracking.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/services/data.service';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';



@Component({
  selector: 'intro-guide',
  templateUrl: 'guide.page.html',
  styleUrls: ['guide.page.scss']
})
export class GuidePage {

  constructor(private router: Router, private platform: Platform, private trackingService: TrackingService, private navController: NavController, private dataService: DataService) {
    // if (this.platform.is('ios')) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Light
    //   });
    // }
    this.dataService.onboardingInProgress("intro/guide");
  }

  public activeClass = 'pink';
  @ViewChild('slider') slidesRef: any;

  next() {
    this.slidesRef.isEnd().then(isEnd => {
      if (isEnd) {
        setTimeout(() => {
          this.navController.navigateForward(['/details']);
        }, environment.ctaAnimationDelay);
      } else {
        this.slidesRef.slideNext();
      }
    });
  }

  slideChanged() {
    this.slidesRef.getActiveIndex().then(index => {
      switch (index) {
        case 0:
          this.activeClass = 'pink';
          this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "orientation screen 1" })
          break;
        case 1:
          this.activeClass = 'green';
          this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "orientation screen 2" })
          break;
        case 2:
          this.activeClass = 'yellow';
          this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "orientation screen 3" })
          break;
      }
      this.dataService.setOrientationPos(index);
    });
  }

  ionViewDidEnter() {
    this.dataService.orientationPos$.subscribe(async (index) => {
      await this.slidesRef.slideTo(index, 0);
      SplashScreen.hide();
    })
    this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "orientation screen 1" })
  }

  goBack() {
    this.slidesRef.getActiveIndex().then(index => {
      if(index === 0){
        this.navController.navigateBack('intro/legal');
      }else{
        this.slidesRef.slidePrev();
      }
    })
  }
}
