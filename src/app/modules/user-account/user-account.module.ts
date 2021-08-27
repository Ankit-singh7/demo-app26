import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BackModule } from 'src/app/global-components/back-button/back.module';
import { CtaModule } from 'src/app/global-components/cta/cta.module';
import { HomepageHeaderModule } from 'src/app/global-components/layout/homepage-header/homepage-header.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { UserAccountRoutingModule } from './user-account-routing.module';
import { UserAccountComponent } from './user-account.page';

@NgModule({
  declarations: [UserAccountComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CtaModule,
    BackModule,
    HomepageHeaderModule,
    UserAccountRoutingModule,
    PasswordResetModule
  ]
})
export class UserAccountModule { }
