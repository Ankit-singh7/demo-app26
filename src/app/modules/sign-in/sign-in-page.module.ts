import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SignInPageRoutingModule } from './sign-in-page-routing.module';
import { SignInPage } from './sign-in.page';
import { BackModule } from 'src/app/global-components/back-button/back.module';
import { CtaModule } from 'src/app/global-components/cta/cta.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SignInModule } from './sign-in/sign-in.module';
import { TermsConditionsModule} from './terms-conditions/terms-conditions.module';
import { RegisterModule } from './register/register.module';
import { MarketingModule } from './marketing/marketing.module';

@NgModule({
  declarations: [SignInPage],
  imports: [
    IonicModule,
    CommonModule,
    SignInModule,
    SignInPageRoutingModule,
    ReactiveFormsModule,
    BackModule,
    CtaModule,
    RegisterModule,
    TermsConditionsModule,
    MarketingModule
  ]
})
export class SignInPageModule { }
