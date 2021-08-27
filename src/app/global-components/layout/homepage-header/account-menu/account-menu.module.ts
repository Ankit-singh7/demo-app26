import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountMenuComponent } from './account-menu.component';
import { IonicModule } from '@ionic/angular';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [AccountMenuComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatMenuModule
  ],
  exports: [
    AccountMenuComponent
  ]
})
export class AccountMenuModule { }
