import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoErrorPopoverComponent } from './info-error-popover.component';
import { IonicModule } from '@ionic/angular';
import { CtaModule } from '../cta/cta.module';



@NgModule({
  declarations: [InfoErrorPopoverComponent],
  imports: [
    IonicModule,
    CommonModule,
    CtaModule
  ],
  exports: [InfoErrorPopoverComponent]
})
export class InfoErrorPopoverModule { }
