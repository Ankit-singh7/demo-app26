import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CameraRoutingModule } from './camera-routing.module';

import { CameraPage } from './camera.page';
import { ResultsModalModule } from './modal/results.modal.module';
import { SpinnerModule } from 'src/app/global-components/spinner/spinner.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CameraRoutingModule,
    ResultsModalModule,
    SpinnerModule,
  ],
  declarations: [CameraPage]
})
export class CameraModule {}
