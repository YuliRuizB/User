import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckRequestPreRegisterPageRoutingModule } from './check-request-pre-register-routing.module';

import { CheckRequestPreRegisterPage } from './check-request-pre-register.page';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckRequestPreRegisterPageRoutingModule,
		NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
			units: '',
			// showSubtitle: false,
    })
  ],
  declarations: [CheckRequestPreRegisterPage]
})
export class CheckRequestPreRegisterPageModule {}
