import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeightPopoverComponent } from './weight-popover.component';



@NgModule({
  declarations: [WeightPopoverComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    WeightPopoverComponent
  ]
})
export class WeightPopoverModule { }
