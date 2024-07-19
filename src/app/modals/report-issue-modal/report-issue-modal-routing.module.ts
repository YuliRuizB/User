import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportIssueModalPage } from './report-issue-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ReportIssueModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportIssueModalPageRoutingModule {}
