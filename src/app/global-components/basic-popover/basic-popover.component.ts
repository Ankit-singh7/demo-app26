import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-basic-popover',
  templateUrl: './basic-popover.component.html',
  styleUrls: ['./basic-popover.component.scss'],
})
export class BasicPopoverComponent implements OnInit {
  @Input() title: string;
  @Input() text: string;
  @Input() icon: string;
  @Input() imageUrl: string;
  @Input() ctaText: string;
  @Input() ctaTextAlt: string;
  @Input() overflow: boolean;
  @Input() callback: Function;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  async close() {
    await this.popoverController.dismiss()
  }

  async action() {
    (this.callback) ? await this.callback() : await this.close()
  }
}
