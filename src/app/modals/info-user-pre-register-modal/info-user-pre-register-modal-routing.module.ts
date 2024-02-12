import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoUserPreRegisterModalPage } from './info-user-pre-register-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InfoUserPreRegisterModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoUserPreRegisterModalPageRoutingModule {}
