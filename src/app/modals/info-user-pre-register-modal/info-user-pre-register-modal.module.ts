import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoUserPreRegisterModalPageRoutingModule } from './info-user-pre-register-modal-routing.module';

import { InfoUserPreRegisterModalPage } from './info-user-pre-register-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoUserPreRegisterModalPageRoutingModule
  ],
  declarations: [InfoUserPreRegisterModalPage]
})
export class InfoUserPreRegisterModalPageModule {}
