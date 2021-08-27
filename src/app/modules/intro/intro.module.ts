import { GuidePage } from './components/guide/guide.page';
import { WelcomePage } from './components/welcome/welcome.page';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntroRoutingModule } from './intro-routing.module';
import { Intro } from './intro.page';
import { CtaModule } from 'src/app/global-components/cta/cta.module';
import { LegalPage } from './components/legal/legal.page';
import { BackModule } from '../../global-components/back-button/back.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    IntroRoutingModule,
    CtaModule,
    BackModule
  ],
  declarations: [Intro, WelcomePage, LegalPage, GuidePage]
})
export class IntroModule {}
