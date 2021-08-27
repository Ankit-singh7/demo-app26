import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BasicPopoverComponent } from './basic-popover.component';
import { CtaModule } from '../cta/cta.module';



@NgModule({
  declarations: [BasicPopoverComponent],
  imports: [
    IonicModule,
    CtaModule,
    CommonModule
  ],
  exports: [BasicPopoverComponent]
})
export class BasicPopoverModule { }
