import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';

const routes: Routes = [
  {
    path: 'homepage-tabs',
    loadChildren: () => import('./modules/homepage-tabs/homepage-tabs.module').then(m => m.HomepageTabsPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./modules/intro/intro.module').then(m => m.IntroModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./modules/details/details.module').then(m => m.DetailsModule)
  },
  {
    path: 'camera',
    loadChildren: () => import('./modules/camera/camera.module').then(m => m.CameraModule)
  },
  {
    path: 'tell-us-more',
    loadChildren: () => import('./modules/tell-us-more/tell-us-more.module').then(m => m.TellUsMoreModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./modules/sign-in/sign-in-page.module').then(m => m.SignInPageModule)
  },
  {
    path: 'user-account',
    loadChildren: () => import('./modules/user-account/user-account.module').then(m => m.UserAccountModule)
  },
  {
    path: '',
    redirectTo: '/intro/welcome',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
