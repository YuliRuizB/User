import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StationInfoPage } from './station-info.page';

const routes: Routes = [
  {
    path: '',
    component: StationInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StationInfoPageRoutingModule {}
