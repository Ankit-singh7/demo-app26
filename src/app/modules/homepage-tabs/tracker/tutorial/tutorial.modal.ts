import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.modal.html',
  styleUrls: ['./tutorial.modal.scss'],
})
export class TutorialModal implements OnInit {
  @ViewChild('anchor') anchor: ElementRef;
  @ViewChild('tutorialContent') content: IonContent;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async close(skipDelay = false) {
    setTimeout(async () => {
      await this.modalController.dismiss();
    }, skipDelay ? 0 : environment.ctaAnimationDelay);
  }

  scroll() {
    let yOffset = document.getElementById('technology-we-use').offsetTop;
    this.content.scrollToPoint(0, yOffset, 2000);
  }
}
