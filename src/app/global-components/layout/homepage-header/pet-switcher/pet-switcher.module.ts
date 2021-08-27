import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetSwitcherComponent } from './pet-switcher.component';
import { IonicModule } from '@ionic/angular';
import { PetPhotoPipe } from 'src/app/pipes/pet-photo.pipe';



@NgModule({
  declarations: [PetSwitcherComponent, PetPhotoPipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PetSwitcherComponent
  ]
})
export class PetSwitcherModule { }
