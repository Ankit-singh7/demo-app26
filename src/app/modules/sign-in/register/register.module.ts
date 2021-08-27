import { NgModule } from '@angular/core';
import { RegisterComponent } from './register.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CtaModule } from '../../../global-components/cta/cta.module';
import { PasswordCheckerModule } from 'src/app/global-components/password-checker/password-checker.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    CtaModule,
    PasswordCheckerModule
  ],
  exports: [RegisterComponent]
})
export class RegisterModule { }
