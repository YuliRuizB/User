import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryLoginPage } from './history-login.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryLoginPageRoutingModule {}
