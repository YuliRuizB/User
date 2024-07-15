import { NgModule } from "@angular/core";
import { FAQPage } from './faq.page';
import { FAQPageRoutingModule } from "./faq-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
 imports: [ 
    FormsModule,
    IonicModule,
    CommonModule,
    FAQPageRoutingModule
 ],
 declarations: [FAQPage] 
})
export class FAQPageModule {}