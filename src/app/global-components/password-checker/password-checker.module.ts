import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordCheckerComponent } from './password-checker.component';



@NgModule({
  declarations: [PasswordCheckerComponent],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    PasswordCheckerComponent
  ]
})
export class PasswordCheckerModule { }
