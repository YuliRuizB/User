import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutesFullUsersPageRoutingModule } from './routes-full-users-routing.module';

import { RoutesFullUsersPage } from './routes-full-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoutesFullUsersPageRoutingModule
  ],
  declarations: [RoutesFullUsersPage]
})
export class RoutesFullUsersPageModule {}
