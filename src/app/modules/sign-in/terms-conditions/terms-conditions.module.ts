import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CtaModule } from '../../../global-components/cta/cta.module';
import { TermsConditionsComponent } from './terms-conditions.component';
import { HomepageHeaderModule } from 'src/app/global-components/layout/homepage-header/homepage-header.module';
import { BackModule } from 'src/app/global-components/back-button/back.module';



@NgModule({
  declarations: [TermsConditionsComponent],
  imports: [
    IonicModule,
    CommonModule,
    BackModule,
    HomepageHeaderModule
  ],
  exports: [TermsConditionsComponent]
})
export class TermsConditionsModule { }
