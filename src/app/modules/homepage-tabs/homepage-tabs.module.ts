import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomepageTabsPageRoutingModule } from './homepage-tabs-routing.module';
import { HomepageTabsPage } from './homepage-tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomepageTabsPageRoutingModule
  ],
  declarations: [HomepageTabsPage]
})
export class HomepageTabsPageModule {}
