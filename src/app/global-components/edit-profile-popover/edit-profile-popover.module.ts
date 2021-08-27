import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CtaModule } from '../cta/cta.module';
import { EditProfilePopoverComponent } from './edit-profile-popover.component';
import { PetEditingModule } from '../pet-editing/pet-editing.module';



@NgModule({
  declarations: [EditProfilePopoverComponent],
  imports: [
    IonicModule,
    CommonModule,
    CtaModule,
    PetEditingModule
  ],
  exports: [
    EditProfilePopoverComponent
  ]
})
export class EditProfilePopoverModule { }
