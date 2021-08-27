import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageTabsPage } from './homepage-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: HomepageTabsPage,
    children: [
      {
        path: 'tracker',
        loadChildren: () => import('./tracker/tracker.module').then(m => m.TrackerPageModule)
      },
      {
        path: 'insights',
        loadChildren: () => import('./insights/insights.module').then(m => m.InsightsPageModule)
      },
      {
        path: 'tests',
        loadChildren: () => import('./tests/tests.module').then(m => m.TestsPageModule)
      },
      {
        path: 'pets',
        loadChildren: () => import('./pets/pets.module').then(m => m.PetsPageModule)
      },
      {
        path: '',
        redirectTo: '/homepage-tabs/tracker',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/homepage-tabs/tracker',
    // redirectTo: '/homepage-tabs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageTabsPageRoutingModule {}
