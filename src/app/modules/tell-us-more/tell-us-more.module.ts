import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TellUsMoreComponent } from './tell-us-more.page';
import { TellUsMoreRoutingModule } from './tell-us-more-routing.module';
import { SkipComponent } from 'src/app/global-components/skip-button/skip.component';
import { FormsModule } from '@angular/forms';
import { PetEditingModule } from 'src/app/global-components/pet-editing/pet-editing.module';
import { CtaModule } from 'src/app/global-components/cta/cta.module';
import { BackModule } from 'src/app/global-components/back-button/back.module';



@NgModule({
  declarations: [TellUsMoreComponent, SkipComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TellUsMoreRoutingModule,
    PetEditingModule,
    CtaModule,
    BackModule,
  ]
})
export class TellUsMoreModule { }
