import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StopsListPage } from './stops-list.page';

const routes: Routes = [
  {
    path: '',
    component: StopsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StopsListPageRoutingModule {}
