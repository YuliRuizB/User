import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GpsRequestInfoPage } from './gps-request-info.page';

const routes: Routes = [
  {
    path: '',
    component: GpsRequestInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpsRequestInfoPageRoutingModule {}
