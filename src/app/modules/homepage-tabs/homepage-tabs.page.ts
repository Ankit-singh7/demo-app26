import { ToastService } from './../../services/toast.service';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TrackingService } from '../../services/tracking.service';

@Component({
  selector: 'app-homepage-tabs',
  templateUrl: 'homepage-tabs.page.html',
  styleUrls: ['homepage-tabs.page.scss']
})
export class HomepageTabsPage {

  constructor(private navController: NavController, private toastService: ToastService, private trackingService: TrackingService) {}
  goToCamera() {
    this.navController.navigateRoot(['camera'])
  }
  notWorking(screen) {
    this.toastService.showToast(`Sorry, ${screen} isn't working yet!`)
  }
}
