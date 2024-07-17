import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryLoginPageRoutingModule } from './history-login-routing.module';

import { HistoryLoginPage } from './history-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryLoginPageRoutingModule
  ],
  declarations: [HistoryLoginPage]
})
export class HistoryLoginPageModule {}
