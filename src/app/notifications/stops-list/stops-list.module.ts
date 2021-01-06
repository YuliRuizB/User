import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StopsListPageRoutingModule } from './stops-list-routing.module';

import { StopsListPage } from './stops-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StopsListPageRoutingModule
  ],
  declarations: [StopsListPage]
})
export class StopsListPageModule {}
