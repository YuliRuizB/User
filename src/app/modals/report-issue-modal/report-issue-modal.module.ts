import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportIssueModalPageRoutingModule } from './report-issue-modal-routing.module';

import { ReportIssueModalPage } from './report-issue-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportIssueModalPageRoutingModule
  ],
  declarations: [ReportIssueModalPage]
})
export class ReportIssueModalPageModule {}
