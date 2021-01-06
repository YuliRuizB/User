import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StationInfoPageRoutingModule } from './station-info-routing.module';
import { StationInfoPage } from './station-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StationInfoPageRoutingModule
  ],
  declarations: [StationInfoPage]
})
export class StationInfoPageModule {}
