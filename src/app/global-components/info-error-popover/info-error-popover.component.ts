import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-info-error-popover',
  templateUrl: './info-error-popover.component.html',
  styleUrls: ['./info-error-popover.component.scss'],
})
export class InfoErrorPopoverComponent {
  @Input() text: string;
  @Input() ctaText: string;
  @Input() modalType: string;
  constructor(private popoverController: PopoverController) {}

  async close() {
    await this.popoverController.dismiss();
  }
}