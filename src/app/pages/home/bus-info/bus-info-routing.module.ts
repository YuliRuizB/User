import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusInfoPage } from './bus-info.page';

const routes: Routes = [
  {
    path: '',
    component: BusInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusInfoPageRoutingModule {}
