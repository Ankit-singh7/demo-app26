import { Component, Input, OnInit } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-warning-popover',
  templateUrl: './warning-popover.component.html',
  styleUrls: ['./warning-popover.component.scss'],
})
export class WarningPopoverComponent implements OnInit {
  @Input() title: string;
  @Input() text: string;
  @Input() icon: string;
  @Input() cancelText: string;
  @Input() confirmText: string;
  @Input() callback: Function;
  constructor(private popoverController: PopoverController, private navController: NavController) { }

  ngOnInit() {}

  async close() {
    await this.popoverController.dismiss();
  }

  async action() {
    await this.close();
    if (this.callback) await this.callback()
  }
}
