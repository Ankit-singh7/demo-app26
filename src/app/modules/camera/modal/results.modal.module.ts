import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsModal } from './results.modal';
import { IonicModule } from '@ionic/angular';
import { RecordModule } from 'src/app/global-components/record/record.module';
import { FormsModule } from '@angular/forms';
import { HomepageHeaderModule } from 'src/app/global-components/layout/homepage-header/homepage-header.module';
import { CtaModule } from 'src/app/global-components/cta/cta.module';
import { SpinnerModule } from 'src/app/global-components/spinner/spinner.module';
import { CharCountdownPipe } from 'src/app/pipes/chars-countdown.pipe';

@NgModule({
  declarations: [ResultsModal, CharCountdownPipe],
  imports: [
    IonicModule,
    CommonModule,
    RecordModule,
    FormsModule,
    HomepageHeaderModule,
    CtaModule,
    SpinnerModule,
  ]
})
export class ResultsModalModule { }
