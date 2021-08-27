import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CtaComponent } from './cta.component';



@NgModule({
  declarations: [CtaComponent],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [CtaComponent]
})
export class CtaModule { }
