import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Details } from './details.page';
import { DetailsResolver } from 'src/app/resolvers/details.resolver';

const routes: Routes = [
  {
    path: '',
    component: Details,
    resolve: {
      routeData: DetailsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsRoutingModule {}
