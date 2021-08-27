import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarningPopoverComponent } from './warning-popover.component';
import { IonicModule } from '@ionic/angular';
import { CtaModule } from '../cta/cta.module';



@NgModule({
  declarations: [WarningPopoverComponent],
  imports: [
    IonicModule,
    CommonModule,
    CtaModule
  ],
  exports: [WarningPopoverComponent]
})
export class WarningPopoverModule { }
