import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StopPointsPageRoutingModule } from './stop-points-routing.module';

import { StopPointsPage } from './stop-points.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StopPointsPageRoutingModule
  ],
  declarations: [StopPointsPage]
})
export class StopPointsPageModule {}
