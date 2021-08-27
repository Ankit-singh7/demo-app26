import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestsPage } from './tests.page';
import { TestsPageRoutingModule } from './tests-routing.module';
import { CtaModule } from 'src/app/global-components/cta/cta.module';
import { HomepageHeaderModule } from 'src/app/global-components/layout/homepage-header/homepage-header.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TestsPageRoutingModule,
    CtaModule,
    HomepageHeaderModule,
  ],
  declarations: [TestsPage]
})
export class TestsPageModule {}
