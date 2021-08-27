import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordComponent } from './record.component';
import { TimezonePipe } from 'src/app/pipes/timezone.pipe';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [RecordComponent, TimezonePipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    RecordComponent
  ]
})
export class RecordModule { }
