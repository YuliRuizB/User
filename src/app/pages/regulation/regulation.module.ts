import { NgModule } from "@angular/core";
import { RegulationPage } from './regulation.page';
import { RegulationPageRoutingModule } from "./regulation-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
 imports: [ 
    FormsModule,
    IonicModule,
    CommonModule,
    RegulationPageRoutingModule
 ],
 declarations: [RegulationPage] 
})
export class RegulationPageModule {}