import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsightsPage } from './insights.page';
import { InsightsPageRoutingModule } from './insights-routing.module';
import { PinnedResultModule } from 'src/app/global-components/pinned-result/pinned-result.module';
import { OverviewTileComponent } from 'src/app/global-components/overview-tile/overview-tile.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { HomepageHeaderModule } from 'src/app/global-components/layout/homepage-header/homepage-header.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    InsightsPageRoutingModule,
    PinnedResultModule,
    MatExpansionModule,
    HomepageHeaderModule,
  ],
  declarations: [InsightsPage, OverviewTileComponent]
})
export class InsightsPageModule {}
