import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Intro } from './intro.page';
import { WelcomePage } from './components/welcome/welcome.page';
import { GuidePage } from './components/guide/guide.page';
import { LegalPage } from './components/legal/legal.page';

const routes: Routes = [
  {
    path: '',
    component: Intro,
    children: [
      {
        path: 'welcome',
        component: WelcomePage
      },
      {
        path: 'legal',
        component: LegalPage 
      },
      {
        path: 'guide',
        component: GuidePage
      },
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntroRoutingModule {}
