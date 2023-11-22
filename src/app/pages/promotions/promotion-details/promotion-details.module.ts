import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromotionDetailsPageRoutingModule } from './promotion-details-routing.module';

import { PromotionDetailsPage } from './promotion-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotionDetailsPageRoutingModule
  ],
  declarations: [PromotionDetailsPage]
})
export class PromotionDetailsPageModule {}
