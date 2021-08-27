import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PinnedResultComponent } from './pinned-result.component';
import { CtaModule } from '../cta/cta.module';



@NgModule({
  declarations: [PinnedResultComponent],
  imports: [
    IonicModule,
    CommonModule,
    CtaModule
  ],
  exports: [PinnedResultComponent]
})
export class PinnedResultModule { }
