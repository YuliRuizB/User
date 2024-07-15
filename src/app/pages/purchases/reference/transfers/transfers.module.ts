import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransfersPageRoutingModule } from './transfers-routing.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer'
import { TransfersPage } from './transfers.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
		NgxDocViewerModule,
		PdfViewerModule,
    TransfersPageRoutingModule
  ],
  declarations: [TransfersPage]
})
export class TransfersPageModule {}
