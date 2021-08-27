import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BackComponent } from './back.component';

@NgModule({
  declarations: [BackComponent],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [BackComponent]
})
export class BackModule { }
