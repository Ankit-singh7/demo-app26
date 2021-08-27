import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetsPage } from './pets.page';
import { PetsPageRoutingModule } from './pets-routing.module';
import { EditProfilePopoverModule } from 'src/app/global-components/edit-profile-popover/edit-profile-popover.module';
import { HomepageHeaderModule } from 'src/app/global-components/layout/homepage-header/homepage-header.module';
import { CtaModule } from 'src/app/global-components/cta/cta.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PetsPageRoutingModule,
    EditProfilePopoverModule,
    HomepageHeaderModule,
    CtaModule
  ],
  declarations: [PetsPage]
})
export class PetsPageModule {
}
