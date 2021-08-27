import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss'],
})
export class MarketingComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async goBack() {
    await this.modalController.dismiss();
  }
}
