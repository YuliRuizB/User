import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutesFullUsersPage } from './routes-full-users.page';

const routes: Routes = [
  {
    path: '',
    component: RoutesFullUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutesFullUsersPageRoutingModule {}
