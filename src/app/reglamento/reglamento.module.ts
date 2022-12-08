import { NgModule } from "@angular/core";
import { ReglamentoPage } from './reglamento.page';
import { ReglamentoPageRoutingModule } from "./reglamento-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
 imports: [ 
    FormsModule,
    IonicModule,
    CommonModule,
    ReglamentoPageRoutingModule
 ],
 declarations: [ReglamentoPage] 
})
export class ReglamentoPageModule {}