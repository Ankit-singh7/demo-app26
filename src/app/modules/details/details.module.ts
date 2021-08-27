import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DetailsRoutingModule } from './details-routing.module';

import { Details } from './details.page';
import { WarningPopoverModule } from 'src/app/global-components/warning-popover/warning-popover.module';
import { CtaModule } from '../../global-components/cta/cta.module';
import { BackModule } from 'src/app/global-components/back-button/back.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DetailsRoutingModule,
    WarningPopoverModule,
    CtaModule,
    BackModule,
  ],
  declarations: [Details],
  exports: [CtaModule]
})
export class DetailsModule {}
