import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomepageHeaderComponent } from './homepage-header.component';
import { AccountMenuModule } from './account-menu/account-menu.module';
import { BackModule } from '../../back-button/back.module';



@NgModule({
  declarations: [HomepageHeaderComponent],
  imports: [
    IonicModule,
    CommonModule,
    AccountMenuModule,
    BackModule
  ],
  exports: [HomepageHeaderComponent]
})
export class HomepageHeaderModule { }
