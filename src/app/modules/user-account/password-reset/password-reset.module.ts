import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BackModule } from 'src/app/global-components/back-button/back.module';
import { HomepageHeaderModule } from 'src/app/global-components/layout/homepage-header/homepage-header.module';
import { CtaModule } from 'src/app/global-components/cta/cta.module';
import { PasswordResetComponent } from './password-reset.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordCheckerModule } from 'src/app/global-components/password-checker/password-checker.module';



@NgModule({
  declarations: [PasswordResetComponent],
  imports: [
    IonicModule,
    CommonModule,
    BackModule,
    HomepageHeaderModule,
    CtaModule,
    ReactiveFormsModule,
    PasswordCheckerModule
  ],
  exports: [PasswordResetComponent]
})
export class PasswordResetModule { }
