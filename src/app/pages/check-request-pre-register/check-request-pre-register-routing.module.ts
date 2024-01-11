import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckRequestPreRegisterPage } from './check-request-pre-register.page';

const routes: Routes = [
  {
    path: '',
    component: CheckRequestPreRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckRequestPreRegisterPageRoutingModule {}
