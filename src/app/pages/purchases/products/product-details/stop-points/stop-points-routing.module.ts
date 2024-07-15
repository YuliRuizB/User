import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StopPointsPage } from './stop-points.page';

const routes: Routes = [
  {
    path: '',
    component: StopPointsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StopPointsPageRoutingModule {}
