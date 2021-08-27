import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialModal } from './tutorial.modal';
import { IonicModule } from '@ionic/angular';
import { CtaModule } from 'src/app/global-components/cta/cta.module';

@NgModule({
  declarations: [TutorialModal],
  imports: [
    IonicModule,
    CtaModule,
    CommonModule
  ]
})
export class TutorialModule { }
