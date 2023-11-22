import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotionDetailsPage } from './promotion-details.page';

const routes: Routes = [
  {
    path: '',
    component: PromotionDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionDetailsPageRoutingModule {}
