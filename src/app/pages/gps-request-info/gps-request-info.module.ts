import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GpsRequestInfoPageRoutingModule } from './gps-request-info-routing.module';

import { GpsRequestInfoPage } from './gps-request-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GpsRequestInfoPageRoutingModule
  ],
  declarations: [GpsRequestInfoPage]
})
export class GpsRequestInfoPageModule {}
