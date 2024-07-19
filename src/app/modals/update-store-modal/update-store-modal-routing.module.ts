import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateStoreModalPage } from './update-store-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateStoreModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateStoreModalPageRoutingModule {}
