import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateStoreModalPageRoutingModule } from './update-store-modal-routing.module';

import { UpdateStoreModalPage } from './update-store-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateStoreModalPageRoutingModule
  ],
  declarations: [UpdateStoreModalPage]
})
export class UpdateStoreModalPageModule {}
