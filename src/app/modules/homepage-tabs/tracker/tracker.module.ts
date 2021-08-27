import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerPage } from './tracker.page';
import { TrackerPageRoutingModule } from './tracker-routing.module';
import { RecordModule } from 'src/app/global-components/record/record.module';
import { BasicPopoverModule } from 'src/app/global-components/basic-popover/basic-popover.module';
import { TutorialModule } from './tutorial/tutorial.modal.module';
import { CtaModule } from 'src/app/global-components/cta/cta.module';
import { HomepageHeaderModule } from 'src/app/global-components/layout/homepage-header/homepage-header.module';
import { GroupByPipe } from 'src/app/pipes/group-by.pipe';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CtaModule,
    TrackerPageRoutingModule,
    RecordModule,
    BasicPopoverModule,
    TutorialModule,
    HomepageHeaderModule,
  ],
  declarations: [TrackerPage, GroupByPipe]
})
export class TrackerPageModule {}
