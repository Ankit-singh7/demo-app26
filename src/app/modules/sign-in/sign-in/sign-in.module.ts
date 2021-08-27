import { NgModule } from '@angular/core';
import { SignInComponent } from './sign-in.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CtaModule } from '../../../global-components/cta/cta.module';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    IonicModule,
    CommonModule,
    CtaModule,
    ReactiveFormsModule,
  ],
  exports: [SignInComponent]
})
export class SignInModule { }
